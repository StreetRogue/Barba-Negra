import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Servicio } from '../../../core/domain/models/Servicio';
import { ICategoria } from '../../../core/domain/models/ICategoria'; 
import { ServicioFacade } from '../../../core/facade/ServicioFacade'; 
import { CategoriaFacade } from '../../../core/facade/CategoriaFacade';

@Component({
  selector: 'app-editar-servicio-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-servicio-modal.component.html',
  styleUrls: ['./editar-servicio-modal.component.css']
})
export class EditarServicioModalComponent implements OnInit {

  // --- Inputs y Outputs ---
  @Input() servicio!: Servicio;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  // --- Estado local ---
  public categorias: ICategoria[] = [];
  public imagePreview = signal<string | null>(null);

  constructor(
    private servicioFacade: ServicioFacade,
    private categoriaFacade: CategoriaFacade
  ) {}

  ngOnInit(): void {
    this.loadCategorias();

    if (this.servicio.objCategoria) {
      this.servicio.objCategoria = {
        id: this.servicio.objCategoria.id,
        nombre: this.servicio.objCategoria.nombre
      };
    }
  }

  // --- Cargar categorías ---
  loadCategorias(): void {
    this.categoriaFacade.getCategorias().subscribe({
      next: categorias => (this.categorias = categorias),
      error: err => console.error('Error cargando categorías', err)
    });
  }

  // --- Cargar imagen ---
  public onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      this.servicio.imagenBase64 = this.imagePreview();
      return;
    }

    if (!file.type.startsWith('image/')) {
      Swal.fire('Archivo inválido', 'Por favor seleccione un archivo de imagen.', 'error');
      event.target.value = null;
      return;
    }

    const maxSizeInBytes = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSizeInBytes) {
      Swal.fire('Archivo muy grande', 'La imagen no puede pesar más de 4MB.', 'error');
      event.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.servicio.imagenBase64 = e.target.result;
      this.imagePreview.set(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  // --- Actualizar servicio ---
  actualizarServicio(form: NgForm): void {
    if (form.invalid) {
      Swal.fire('Formulario inválido', 'Por favor revise los campos.', 'warning');
      return;
    }

    this.servicioFacade.update(this.servicio).subscribe({
      next: response => {
        Swal.fire('¡Actualizado!', `El servicio "${response.nombre}" ha sido actualizado.`, 'success');
        this.save.emit();
      },
      error: err => {
        console.error('Error actualizando servicio:', err);
        Swal.fire('Error', 'No se pudo actualizar el servicio.', 'error');
      }
    });
  }

  // --- Cerrar modal ---
  cerrarModal(): void {
    this.close.emit();
  }

  // --- Comparador para el select ---
  compararCategorias(c1: ICategoria, c2: ICategoria): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
