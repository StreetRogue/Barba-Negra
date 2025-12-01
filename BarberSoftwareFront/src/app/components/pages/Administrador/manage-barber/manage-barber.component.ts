import { Component, OnInit } from '@angular/core';
import { BarberoFacade } from '../../../../core/facade/BarberoFacade';
import { RegisterBarberoDTO } from '../../../../core/domain/models/DTOs/Barbero/RegisterBarberoDTO';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarberoDTORespuesta } from '../../../../core/domain/models/DTOs/Barbero/BarberoRespuestaDTO';
import { HorarioLaboralDTOPeticion } from '../../../../core/domain/models/DTOs/Horarios/HorarioLaboralPeticionDTO';
import { BarberoServicioRespuestaDTO } from '../../../../core/domain/models/DTOs/BarberoServicio/BarberoServicioRespuestaDTO';
import { ServicioDTORespuesta } from '../../../../core/domain/models/DTOs/Servicio/ServicioRespuestaDTO';
import { ServicioFacade } from '../../../../core/facade/ServicioFacade';

@Component({
  selector: 'app-manage-barber',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-barber.component.html',
  styleUrl: './manage-barber.component.css'
})
export class ManageBarberComponent implements OnInit {

  nuevoBarbero: RegisterBarberoDTO = {
    nombre: '',
    email: '',
    telefono: '',
    imagenUrl: 'assets/images/avatar.png' // Imagen por defecto
  };

  barberoEdicion: BarberoDTORespuesta = {
    id: 0,
    nombre: '',
    email: '',
    telefono: '',
    estado: ''
  };

  mostrarModal: boolean = false;
  estadoActivo: boolean = false;
  mostrarModalHorario: boolean = false;
  barberoSeleccionadoId: number = 0;
  nombreBarberoSeleccionado: string = '';
  diasSemana = [
    { dia: 1, nombre: 'Lunes' },
    { dia: 2, nombre: 'Martes' },
    { dia: 3, nombre: 'Miércoles' },
    { dia: 4, nombre: 'Jueves' },
    { dia: 5, nombre: 'Viernes' },
    { dia: 6, nombre: 'Sábado' },
    { dia: 7, nombre: 'Domingo' }
  ];

  mostrarModalServicios: boolean = false;
  serviciosAsignados: BarberoServicioRespuestaDTO[] = []; // Lo que ya sabe hacer
  catalogoServicios: ServicioDTORespuesta[] = []; // Todos los servicios disponibles
  servicioSeleccionadoId: number | null = null; // Para el select del modal
  loading: boolean = false;

  constructor(private barberoFacade: BarberoFacade, private servicioFacade: ServicioFacade) { }

  listaBarberos: BarberoDTORespuesta[] = [];
  formularioHorarios: HorarioLaboralDTOPeticion[] = [];
  filtroBusqueda: string = '';

  abrirModalEditar(barbero: BarberoDTORespuesta) {
    // Rompemos la referencia usando spread operator {...}
    this.barberoEdicion = { ...barbero };

    // Convertimos el string 'ACTIVO' a boolean para el switch
    this.estadoActivo = this.barberoEdicion.estado === 'Activo';

    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  registrarBarbero() {
    if (!this.validarDatos(this.nuevoBarbero)) {
      return; // Detenemos si hay error
    }
    // 2. Flujo normal
    this.barberoFacade.registrar(this.nuevoBarbero).subscribe({
      next: (response) => {
        console.log('Barbero creado:', response);
        Swal.fire('¡Éxito!', 'Barbero registrado correctamente', 'success');
        this.limpiarFormulario();
        this.cargarBarberos(); // Recargamos la lista
      },
      error: (err) => {
        console.error('Error al crear barbero:', err);
        // Manejo de errores específicos del backend
        if (err.status === 409) {
          Swal.fire('Error', 'El correo electrónico ya está registrado.', 'error');
        } else {
          Swal.fire('Error', 'No se pudo registrar el barbero. Intenta nuevamente.', 'error');
        }
      }
    });
  }

  // --- FUNCIÓN AUXILIAR DE VALIDACIÓN ---
  private validarDatos(datos: RegisterBarberoDTO): boolean {

    // A. Validar Campos Vacíos (Trim elimina espacios en blanco)
    if (!datos.nombre.trim() || !datos.email.trim() || !datos.telefono.trim()) {
      Swal.fire('Campos incompletos', 'Por favor, llena todos los campos. No se permiten espacios vacíos.', 'warning');
      return false;
    }

    // B. Validar Formato de Email (Regex simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datos.email)) {
      Swal.fire('Correo inválido', 'Por favor ingresa un correo electrónico válido (ej: usuario@dominio.com).', 'warning');
      return false;
    }

    // C. Validar Teléfono (Solo números y longitud mínima)
    // Acepta +57... o solo números. Elimina espacios y guiones para contar.
    const cleanPhone = datos.telefono.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      Swal.fire('Teléfono inválido', 'El número de teléfono debe tener entre 7 y 15 dígitos.', 'warning');
      return false;
    }

    return true; // Todo OK
  }

  ngOnInit(): void {
    this.cargarBarberos();
    this.cargarCatalogoServicios();
  }

  limpiarFormulario() {
    this.nuevoBarbero = {
      nombre: '',
      email: '',
      telefono: '',
      imagenUrl: 'assets/images/avatar.png'
    };
  }

  cargarBarberos() {
    this.loading = true;

    this.barberoFacade.listarBarberos().subscribe({
      next: (datos) => {
        console.log('Lista cargada:', datos);
        this.listaBarberos = datos;
        this.loading = false; // Desactivamos spinner
      },
      error: (err) => {
        console.error('Error cargando la lista:', err);
        this.loading = false; // Desactivamos spinner incluso si falla
      }
    });
  }

  actualizarBarbero() {
    // 1. Convertimos el boolean del switch al string que espera el Backend
    this.barberoEdicion.estado = this.estadoActivo ? 'Activo' : 'Inactivo';

    // 2. Llamamos a la Facade
    this.barberoFacade.actualizarBarbero(this.barberoEdicion.id, this.barberoEdicion).subscribe({
      next: (res) => {
        Swal.fire('Actualizado', 'Información actualizada correctamente', 'success');
        this.cerrarModal();
        this.cargarBarberos(); // Recargamos la lista
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo actualizar la información', 'error');
      }
    });
  }

  abrirModalHorario(barbero: any) { // Recibe el barbero de la lista
    this.barberoSeleccionadoId = barbero.id;
    this.nombreBarberoSeleccionado = barbero.nombre;
    this.mostrarModalHorario = true;

    // Inicializamos vacío por defecto
    this.inicializarHorariosVacios();

    // Consultamos si ya tiene horarios guardados
    this.barberoFacade.obtenerHorarios(barbero.id).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.mapearHorariosExistentes(data);
        }
      },
      error: (err) => console.log('No tiene horarios o error', err)
    });
  }

  inicializarHorariosVacios() {
    this.formularioHorarios = this.diasSemana.map(d => ({
      idBarbero: this.barberoSeleccionadoId,
      diaSemana: d.dia,
      horaInicio: '08:00', // Valor por defecto
      horaFin: '17:00',
      esDiaLibre: false
    }));
  }

  mapearHorariosExistentes(datosBack: any[]) {
    // Actualizamos el formulario con lo que viene del back
    this.formularioHorarios.forEach(diaForm => {
      const diaBack = datosBack.find(d => d.diaSemana === diaForm.diaSemana);
      if (diaBack) {
        diaForm.horaInicio = diaBack.horaInicio;
        diaForm.horaFin = diaBack.horaFin;
        diaForm.esDiaLibre = diaBack.esDiaLibre;
      }
    });
  }

  guardarHorarios() {
    // Preparamos datos: Si es día libre, mandamos null en las horas (opcional, depende de tu back)
    const datosAEnviar = this.formularioHorarios.map(h => ({
      ...h,
      idBarbero: this.barberoSeleccionadoId,
      horaInicio: h.esDiaLibre ? '' : h.horaInicio, // O null si tu DTO acepta null
      horaFin: h.esDiaLibre ? '' : h.horaFin
    }));

    this.barberoFacade.guardarHorarios(datosAEnviar).subscribe({
      next: () => {
        Swal.fire('Guardado', 'Horarios establecidos correctamente', 'success');
        this.cerrarModalHorario();
      },
      error: (err) => Swal.fire('Error', 'No se pudieron guardar los horarios', 'error')
    });
  }

  cerrarModalHorario() {
    this.mostrarModalHorario = false;
  }

  cargarCatalogoServicios() {
    this.servicioFacade.listar().subscribe({
      next: (data) => this.catalogoServicios = data
    });
  }

  abrirModalServicios(barbero: BarberoDTORespuesta) {
    this.barberoSeleccionadoId = barbero.id;
    this.nombreBarberoSeleccionado = barbero.nombre;
    this.mostrarModalServicios = true;
    this.servicioSeleccionadoId = null;

    // Cargar lo que este barbero ya tiene asignado
    this.cargarServiciosAsignados();
  }

  cargarServiciosAsignados() {
    this.barberoFacade.listarServiciosAsignados(this.barberoSeleccionadoId).subscribe({
      next: (data) => this.serviciosAsignados = data,
      error: (err) => console.error('Error cargando servicios del barbero', err)
    });
  }

  asignarServicio() {
    if (!this.servicioSeleccionadoId) return;

    // Verificar si ya lo tiene (opcional, para feedback rápido)
    const yaExiste = this.serviciosAsignados.some(s => s.servicioId == this.servicioSeleccionadoId);
    if (yaExiste) {
      Swal.fire('Atención', 'Este barbero ya tiene asignado ese servicio', 'warning');
      return;
    }

    this.barberoFacade.asignarServicio({
      barberoId: this.barberoSeleccionadoId,
      servicioId: this.servicioSeleccionadoId
    }).subscribe({
      next: (res) => {
        // Swal.fire('Asignado', 'Servicio agregado correctamente', 'success');
        this.servicioSeleccionadoId = null; // Limpiar select
        this.cargarServiciosAsignados(); // Recargar lista
      },
      error: (err) => Swal.fire('Error', 'No se pudo asignar el servicio', 'error')
    });
  }

  desasignarServicio(item: BarberoServicioRespuestaDTO) {
    Swal.fire({
      title: '¿Quitar especialidad?',
      text: `¿Deseas que ${this.nombreBarberoSeleccionado} deje de realizar "${item.nombreServicio}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, quitar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.barberoFacade.desasignarServicio(this.barberoSeleccionadoId, item.servicioId).subscribe({
          next: () => {
            this.cargarServiciosAsignados();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar', 'error')
        });
      }
    });
  }

  cerrarModalServicios() {
    this.mostrarModalServicios = false;
  }


  get barberosFiltrados() {
    const termino = this.filtroBusqueda.toLowerCase();
    return this.listaBarberos.filter(b =>
      b.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
      b.email.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
      (b.estado || '').toLowerCase().startsWith(termino)
    );
  }
}
