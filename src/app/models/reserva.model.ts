import { ServicioTipo } from './servicio.model';

export type EstadoReserva = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';

export interface ServicioSeleccionado {
  servicioId: ServicioTipo;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Reserva {
  id: string;
  usuarioId: string;
  salaId: string;
  salaNombre: string;
  fecha: string;
  hora: string;
  duracionHoras: number;
  precioSala: number;
  servicios: ServicioSeleccionado[];
  precioServicios: number;
  precioTotal: number;
  estado: EstadoReserva;
  notas?: string;
  creadoEn: string;
}

export interface NuevaReservaPayload {
  usuarioId: string;
  salaId: string;
  fecha: string;
  hora: string;
  duracionHoras: number;
  servicios: ServicioSeleccionado[];
  notas?: string;
}
