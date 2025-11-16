import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component'; 
import { LoginPageComponent } from './components/pages/login/login.component'; 
import { ClienteDashboardComponent } from './components/pages/cliente-dashboard/cliente-dashboard.component';
import { AdminDashboardComponent } from './components/pages/admin-dashboard/admin-dashboard.component';
import { RegistrarProductoComponent } from './components/pages/registrar-producto/registrar-producto.component'; 
import { ListarProductoComponent } from './components/pages/listar-producto/listar-producto.component'; 
import { VerPorCategoriaComponent } from './components/pages/ver-categoria/ver-categoria.component'; 
import { ServicioCatalogoComponent } from './components/pages/servicio-catalogo/servicio-catalogo.component'; 
import { CuponesComponent } from './components/pages/cupones/cupones.component'; 
import { AyudaComponent } from './components/pages/ayuda/ayuda.component'; 
import { OfertasComponent } from './components/pages/ofertas/ofertas.component'; 

export const routes: Routes = [
  
  // --- Flujo Público / Cliente ---
  { 
    path: '', 
    component: HomeComponent, 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginPageComponent 
  },

  // --- Flujo de Cliente ---
  { 
    path: 'cliente', 
    component: ClienteDashboardComponent 
  },

  { 
    path: 'cliente/ver-servicio', 
    component: ServicioCatalogoComponent 
  },

  
  { 
    path: 'admin', 
    component: AdminDashboardComponent 
  },
  // Rutas anidadas para las funcionalidades del admin
  {
    path: 'admin/registrar-producto',
    component: RegistrarProductoComponent
  },
  {
    path: 'admin/listar-productos',
    component: ListarProductoComponent
  },

   { path: 'admin/ver-categorias', component: VerPorCategoriaComponent },

   { path: 'ofertas', component: OfertasComponent },
   { path: 'cupones', component: CuponesComponent },
   { path: 'ayuda', component: AyudaComponent },

  // --- Ruta Wildcard ---
  // Redirige cualquier ruta no encontrada al inicio
  { 
    path: '**', 
    redirectTo: '' 
  }
];
