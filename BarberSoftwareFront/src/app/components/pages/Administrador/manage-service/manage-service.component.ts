import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

// 1. IMPORTAR LA FACHADA Y LOS DTOs DEL DOMINIO
import { ServicioFacade } from '../../../../core/facade/ServicioFacade';
import { ServicioDTORespuesta } from '../../../../core/domain/models/DTOs/Servicio/ServicioRespuestaDTO';
import { ServicioDTOPeticion } from '../../../../core/domain/models/DTOs/Servicio/ServicioPeticionDTO';
import { CategoriaFacade } from '../../../../core/facade/CategoriaFacade';
import { CategoriaDTORespuesta } from '../../../../core/domain/models/DTOs/Categorias/CategoriaRespuestaDTO';

// Interfaz local para la Vista (Mantiene la compatibilidad con tu HTML actual)
interface ServiceUI {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number; // En el back es duracionMinutos
  activo: boolean;  // En el back es estado ('ACTIVO'/'INACTIVO')
  imagenUrl?: string; // En el back es imagenBase64
  idCategoria?: number; // <--- NUEVO CAMPO PARA EL SELECT
  nombreCategoria?: string; // Para mostrar en la tabla si quieres
}

@Component({
  selector: 'app-manage-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-service.component.html',
  styleUrl: './manage-service.component.css'
})
export class ManageServiceComponent implements OnInit {

  // --- DATOS ---
  listaServicios: ServiceUI[] = [];
  listaCategorias: CategoriaDTORespuesta[] = [];

  // Carrusel
  activeIndex: number = 0;

  // Inspector (Buscador)
  filtroBusqueda: string = '';
  servicioEncontrado: ServiceUI | null = null;

  // Modal Stepper
  mostrarModal: boolean = false;
  stepActual: number = 1;

  // Objeto de edición
  servicioEdicion: ServiceUI = this.inicializarServicio();

  // Archivos
  archivoSeleccionado: File | null = null;
  nombreArchivo: string = '';
  imagenPrevia: string | null = null;

  // 2. INYECTAR LA FACHADA
  constructor(
    private servicioFacade: ServicioFacade,
    private categoriaFacade: CategoriaFacade
  ) { }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    // 1. Cargar Categorías (Necesarias para el formulario)
    this.categoriaFacade.listarCategoria().subscribe({
      next: (cats) => {
        this.listaCategorias = cats;
        // 2. Una vez tenemos categorías, cargamos servicios
        this.cargarServicios();
      },
      error: (err) => console.error('Error cargando categorías', err)
    });
  }

  // --- CARGA DE DATOS REALES ---
  cargarServicios() {
    this.servicioFacade.listar().subscribe({
      next: (data: ServicioDTORespuesta[]) => {
        // Mapeamos la respuesta del backend (DTO) al modelo visual (UI)
        this.listaServicios = data.map(dto => ({
          id: dto.id,
          nombre: dto.nombre,
          descripcion: dto.descripcion,
          precio: dto.precio,
          duracion: dto.duracionMinutos,
          activo: dto.estado === 'ACTIVO',
          imagenUrl: dto.imagenBase64, // El backend debe devolver el string base64 completo o la URL
          idCategoria: dto.categoria?.id, // Mapeamos la categoría actual
          nombreCategoria: dto.categoria?.nombre
        }));

        // Centrar el carrusel en el medio para efecto infinito visual
        if (this.listaServicios.length > 0) {
          this.activeIndex = Math.floor(this.listaServicios.length / 2);
        }
      },
      error: (err) => {
        console.error('Error al listar servicios:', err);
        // Swal.fire('Error', 'No se pudieron cargar los servicios.', 'error');
      }
    });
  }

  // --- LÓGICA DEL CARRUSEL (LOOP VISUAL) ---
  getClass(index: number): string {
    if (this.listaServicios.length === 0) return 'card-hidden';
    if (index === this.activeIndex) return 'card-center';

    const len = this.listaServicios.length;
    const prevIndex = (this.activeIndex - 1 + len) % len;
    const nextIndex = (this.activeIndex + 1) % len;

    if (index === prevIndex) return 'card-left';
    if (index === nextIndex) return 'card-right';
    return 'card-hidden';
  }

  next() {
    if (this.listaServicios.length > 0)
      this.activeIndex = (this.activeIndex + 1) % this.listaServicios.length;
  }
  prev() {
    if (this.listaServicios.length > 0)
      this.activeIndex = (this.activeIndex - 1 + this.listaServicios.length) % this.listaServicios.length;
  }
  setActive(i: number) { this.activeIndex = i; }

  // --- LÓGICA DEL INSPECTOR (BÚSQUEDA) ---
  buscarServicio() {
    if (!this.filtroBusqueda.trim()) {
      this.servicioEncontrado = null;
      return;
    }
    const term = this.filtroBusqueda.toLowerCase();
    this.servicioEncontrado = this.listaServicios.find(s =>
      s.nombre.toLowerCase().includes(term)
    ) || null;
  }

  limpiarBusqueda() {
    this.filtroBusqueda = '';
    this.servicioEncontrado = null;
  }

  // --- LÓGICA MODAL ---
  abrirModalNuevo() {
    this.servicioEdicion = this.inicializarServicio();
    this.resetearArchivo();
    this.stepActual = 1;
    this.mostrarModal = true;
  }

  abrirModalEditar(servicio: ServiceUI) {
    this.servicioEdicion = { ...servicio };
    this.resetearArchivo();
    this.stepActual = 1;

    if (servicio.imagenUrl) {
      this.imagenPrevia = servicio.imagenUrl;
      this.nombreArchivo = 'Imagen Actual';
    }
    this.mostrarModal = true;
  }

  cerrarModal() { this.mostrarModal = false; }

  siguientePaso() {
    const s = this.servicioEdicion;

    // 1. Validar Categoría
    if (!s.idCategoria) {
      Swal.fire('Falta Categoría', 'Por favor selecciona una categoría para el servicio.', 'warning');
      return;
    }

    // 2. Validar Campos de Texto (Nombre y Descripción)
    if (!s.nombre.trim() || !s.descripcion.trim()) {
      Swal.fire('Campos Vacíos', 'El nombre y la descripción son obligatorios.', 'warning');
      return;
    }

    // 3. Validar Números (Precio y Duración)
    if (s.precio <= 0 || s.duracion <= 0) {
      Swal.fire('Valores Inválidos', 'El precio y la duración deben ser mayores a 0.', 'warning');
      return;
    }

    // Si todo está bien, avanzamos
    this.stepActual = 2;
  }

  pasoAnterior() { this.stepActual = 1; }

  // --- GUARDAR EN BACKEND  ---
  guardarServicio() {
    if (!this.imagenPrevia) {
      Swal.fire('Falta Imagen', 'Es obligatorio subir una imagen para el servicio.', 'warning');
      return;
    }

    // --- PREPARACIÓN DEL DTO ---
    const peticion: ServicioDTOPeticion = {
      nombre: this.servicioEdicion.nombre,
      descripcion: this.servicioEdicion.descripcion,
      precio: this.servicioEdicion.precio,
      duracionMinutos: this.servicioEdicion.duracion,
      estado: this.servicioEdicion.activo ? 'ACTIVO' : 'INACTIVO',
      imagenBase64: this.imagenPrevia,
      categoria: { id: this.servicioEdicion.idCategoria! } // El ! asegura a TS que no es undefined porque ya validamos arriba
    };

    // --- LÓGICA DE GUARDADO (CREAR O EDITAR) ---
    Swal.fire({
      title: 'Guardando...',
      didOpen: () => Swal.showLoading()
    });

    if (this.servicioEdicion.id === 0) {
      // CREAR
      this.servicioFacade.crear(peticion).subscribe({
        next: (res) => {
          Swal.fire('Creado', 'Servicio añadido exitosamente', 'success');
          this.cerrarModal();
          this.cargarServicios();
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo crear el servicio', 'error');
        }
      });
    } else {

      this.servicioFacade.actualizar(this.servicioEdicion.id, peticion).subscribe({
        next: (res) => {
          Swal.fire('Actualizado', 'Servicio modificado correctamente', 'success');

          if (this.servicioEncontrado && this.servicioEncontrado.id === this.servicioEdicion.id) {
            Object.assign(this.servicioEncontrado, this.servicioEdicion);
            this.servicioEncontrado.imagenUrl = this.imagenPrevia || '';
            const cat = this.listaCategorias.find(c => c.id === this.servicioEdicion.idCategoria);
            if (cat) this.servicioEncontrado.nombreCategoria = cat.nombre;
          }

          this.cerrarModal();
          this.cargarServicios();
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar el servicio', 'error');
        }
      });
    }
  }

  // --- ELIMINAR ---
  eliminarServicio(servicio: ServiceUI) {
    Swal.fire({
      title: '¿Eliminar Servicio?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioFacade.eliminar(servicio.id).subscribe({
          next: () => {
            this.servicioEncontrado = null;
            this.filtroBusqueda = '';
            this.cargarServicios();
            Swal.fire('Eliminado', 'El servicio ha sido borrado', 'success');
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo eliminar el servicio', 'error');
          }
        });
      }
    });
  }

  // --- MANEJO DE ARCHIVOS (CONVERSIÓN A BASE64) ---
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar solo el tipo
      if (!file.type.match(/image\/*/)) {
        Swal.fire('Error', 'Solo imágenes', 'error');
        return;
      }

      this.archivoSeleccionado = file;
      this.nombreArchivo = file.name;

      // Llamamos a la función mágica de compresión
      this.compressImage(file, 800, 0.8).then(base64 => {
        this.imagenPrevia = base64; // Guardamos la versión ligera
      }).catch(err => {
        console.error(err);
        Swal.fire('Error', 'No se pudo procesar la imagen', 'error');
      });
    }
  }

  /**
   * Redimensiona y comprime una imagen en el navegador usando Canvas.
   * @param file Archivo original
   * @param maxWidth Ancho máximo permitido (ej: 800px)
   * @param quality Calidad JPG (0 a 1)
   */
  compressImage(file: File, maxWidth: number, quality: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const elem = document.createElement('canvas');

          // Lógica de escalado manteniendo proporción (Aspect Ratio)
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }

          elem.width = width;
          elem.height = height;

          const ctx = elem.getContext('2d');
          if (!ctx) {
            reject('No se pudo obtener contexto del canvas');
            return;
          }

          // Dibujar imagen redimensionada en el canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir a Base64 (formato JPEG para mayor compresión)
          // quality reduce drásticamente el peso del string base64
          const data = elem.toDataURL('image/jpeg', quality);

          resolve(data);
        };
        img.onerror = error => reject(error);
      };
      reader.onerror = error => reject(error);
    });
  }

  eliminarImagen() { this.resetearArchivo(); }

  private resetearArchivo() {
    this.archivoSeleccionado = null;
    this.nombreArchivo = '';
    this.imagenPrevia = null;
  }

  private inicializarServicio(): ServiceUI {
    return { id: 0, nombre: '', descripcion: '', precio: 0, duracion: 0, activo: true, idCategoria: undefined };
  }
}