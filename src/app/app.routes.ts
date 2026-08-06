import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from '@core/guards/auth.guard';

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
    path: 'servicios',
    loadComponent: () =>
      import('@features/public/servicios/servicios.component').then(
        (m) => m.ServiciosComponent,
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
  {
    path: 'terminos-condiciones',
    loadComponent: () =>
      import('@features/public/legal/terminos-condiciones.component').then(
        (m) => m.TerminosCondicionesComponent,
      ),
  },
  {
    path: 'privacidad',
    loadComponent: () =>
      import('@features/public/legal/privacidad.component').then(
        (m) => m.PrivacidadComponent,
      ),
  },
  {
    path: 'cookies',
    loadComponent: () =>
      import('@features/public/legal/cookies.component').then(
        (m) => m.CookiesComponent,
      ),
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('@features/public/legal/faq.component').then(
        (m) => m.FaqComponent,
      ),
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('@features/auth/login/login.component').then(
            (m) => m.LoginComponent,
          ),
      },
      {
        path: 'registro',
        loadComponent: () =>
          import('@features/auth/registro/registro.component').then(
            (m) => m.RegistroComponent,
          ),
      },
      {
        path: 'recuperar-password',
        loadComponent: () =>
          import('@features/auth/recuperar-password/recuperar-password.component').then(
            (m) => m.RecuperarPasswordComponent,
          ),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: 'usuario',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@layouts/user-layout/user-layout.component').then(
        (m) => m.UserLayoutComponent,
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@features/usuario/dashboard/dashboard.component').then(
            (m) => m.UsuarioDashboardComponent,
          ),
      },
      {
        path: 'mis-reservas',
        loadComponent: () =>
          import('@features/usuario/mis-reservas/mis-reservas.component').then(
            (m) => m.MisReservasComponent,
          ),
      },
      {
        path: 'nueva-reserva',
        loadComponent: () =>
          import('@features/usuario/nueva-reserva/nueva-reserva.component').then(
            (m) => m.NuevaReservaComponent,
          ),
      },
      {
        path: 'favoritos',
        loadComponent: () =>
          import('@features/usuario/favoritos/favoritos.component').then(
            (m) => m.FavoritosComponent,
          ),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('@features/usuario/perfil/perfil.component').then(
            (m) => m.PerfilComponent,
          ),
      },
      {
        path: 'soporte',
        loadComponent: () =>
          import('@features/usuario/soporte/soporte.component').then(
            (m) => m.SoporteComponent,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('Administrador', 'Editor')],
    loadComponent: () =>
      import('@layouts/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent,
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@features/admin/dashboard/dashboard.component').then(
            (m) => m.AdminDashboardComponent,
          ),
      },
      {
        path: 'reservas',
        loadComponent: () =>
          import('@features/admin/reservas/reservas.component').then(
            (m) => m.AdminReservasComponent,
          ),
      },
      {
        path: 'salas',
        loadComponent: () =>
          import('@features/admin/salas/salas.component').then(
            (m) => m.AdminSalasComponent,
          ),
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard('Administrador')],
        loadComponent: () =>
          import('@features/admin/usuarios/usuarios.component').then(
            (m) => m.AdminUsuariosComponent,
          ),
      },
      {
        path: 'mensajes',
        canActivate: [roleGuard('Administrador')],
        loadComponent: () =>
          import('@features/admin/mensajes/mensajes.component').then(
            (m) => m.AdminMensajesComponent,
          ),
      },
      {
        path: 'eventos',
        canActivate: [roleGuard('Administrador')],
        loadComponent: () =>
          import('@features/admin/eventos/eventos.component').then(
            (m) => m.AdminEventosComponent,
          ),
      },
      {
        path: 'reportes',
        canActivate: [roleGuard('Administrador')],
        loadComponent: () =>
          import('@features/admin/reportes/reportes.component').then(
            (m) => m.AdminReportesComponent,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
