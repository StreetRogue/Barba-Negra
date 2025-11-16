import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ICategoria } from '../../../core/domain/models/ICategoria';
import { Servicio } from '../../../core/domain/models/Servicio';
import { CategoriaFacade } from '../../../core/facade/CategoriaFacade'; 
import { ServicioFacade } from '../../../core/facade/ServicioFacade'; 

@Component({
  selector: 'app-registrar-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registrar-producto.component.html',
  styleUrl: './registrar-producto.component.css'
})
export class RegistrarProductoComponent implements OnInit {

  // --- Estado del Componente ---
  public currentStep = signal<number>(1); // Para el Stepper
  public servicio: Servicio = new Servicio();
  public categorias = signal<ICategoria[]>([]);
  public titulo: string = 'Crear Servicio';
  public imagePreview = signal<string | null>(null);

  // --- 1. Inyección en el Constructor ---
  constructor(
    private categoriaFacade: CategoriaFacade,
    private servicioFacade: ServicioFacade,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Cargar categorías al iniciar
    this.categoriaFacade.loadCategorias();
    this.categoriaFacade.categorias$.subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: (err) => {
        console.error('Error cargando categorías:', err);
        Swal.fire('Error', 'No se pudieron cargar las categorías.', 'error');
      }
    });
  }

  // --- 2. Métodos de navegación del Stepper ---
  nextStep() {
    // Son 3 pasos: Info, Detalles, Logística
    if (this.currentStep() < 4) {
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  // --- 3. Lógica de Subida de Imagen (Base64) ---
  public onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      this.servicio.imagenBase64 = null;
      this.imagePreview.set(null);
      return;
    }

    // Validación simple de tipo de archivo
    if (!file.type.startsWith('image/')) {
      Swal.fire('Archivo inválido', 'Por favor, seleccione un archivo de imagen (jpg, png, webp, etc.).', 'error');
      event.target.value = null; // Limpia el input
      this.servicio.imagenBase64 = null;
      this.imagePreview.set(null);
      return;
    }

    // Validación de tamaño
    const maxSizeInBytes = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSizeInBytes) {
      Swal.fire('Archivo muy grande', `La imagen no puede pesar más de ${maxSizeInBytes / 1024 / 1024}MB.`, 'error');
      event.target.value = null;
      this.servicio.imagenBase64 = null;
      this.imagePreview.set(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.servicio.imagenBase64 = e.target.result;
      this.imagePreview.set(e.target.result); // Actualiza la vista previa
      console.log('Imagen convertida a Base64 (primeros 100 chars):', e.target.result.substring(0, 100));
    };
    reader.onerror = (error) => {
      console.error('Error leyendo el archivo:', error);
      Swal.fire('Error', 'No se pudo leer el archivo de imagen.', 'error');
      this.servicio.imagenBase64 = null;
      this.imagePreview.set(null);
    };
    reader.readAsDataURL(file); // Inicia la conversión
  }


  // --- 4. Envío del Formulario ---
  public crearServicio(formServicio: any): void {
    console.log("Intentando crear servicio...");
    console.log("Formulario válido:", formServicio.valid);
    console.log("Categoría ID seleccionada:", this.servicio.objCategoria);
    if (formServicio.invalid) {
      console.error("Controles inválidos:", formServicio.controls);
    }
    if (formServicio.invalid) {
      // Recorre todos los pasos para mostrar errores
      this.currentStep.set(1);
      setTimeout(() => formServicio.control.markAllAsTouched(), 0);
      Swal.fire('Campos incompletos', 'Por favor, complete todos los campos requeridos en todos los pasos.', 'warning');
      return;
    }


    console.log("Creando servicio con:", this.servicio);
    this.servicioFacade.create(this.servicio).subscribe({
      next: (response) => {
        console.log("Servicio creado exitosamente", response);
        // Navegamos a la lista de productos
        this.router.navigate(['/admin/listar-productos']);
        Swal.fire(
          'Nuevo Servicio',
          `¡Servicio "${response.nombre}" creado con éxito!`,
          'success'
        );
      },
      error: (err) => {
        console.error('Error al crear servicio:', err.message);
        Swal.fire('Error', 'Hubo un problema al crear el servicio.', 'error');
      }
    });
  }
}

