import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/public/home/home.component').then(
        (m) => m.HomeComponent,
      ),
  },
  {
    path: 'salas',
    loadComponent: () =>
      import('@features/public/salas/salas.component').then(
        (m) => m.SalasComponent,
      ),
  },
  {
    path: 'reservas',
    loadComponent: () =>
      import('@features/public/reservas/reservas.component').then(
        (m) => m.ReservasComponent,
      ),
  },
  {
    path: 'nosotros',
    loadComponent: () =>
      import('@features/public/nosotros/nosotros.component').then(
        (m) => m.NosotrosComponent,
      ),
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('@features/public/contacto/contacto.component').then(
        (m) => m.ContactoComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
