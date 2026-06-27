import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'salas',
    loadComponent: () =>
      import('./pages/salas/salas.component').then(m => m.SalasComponent),
  },
  {
    path: 'reservas',
    loadComponent: () =>
      import('./pages/reservas/reservas.component').then(m => m.ReservasComponent),
  },
  {
    path: 'nosotros',
    loadComponent: () =>
      import('./pages/nosotros/nosotros.component').then(m => m.NosotrosComponent),
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./pages/contacto/contacto.component').then(m => m.ContactoComponent),
  },
  { path: '**', redirectTo: '' },
];
