export type TipoNotificacion =
  | 'reserva_confirmada'
  | 'reserva_cancelada'
  | 'recordatorio_reserva'
  | 'cambio_sala_favorita';

export interface DispositivoWearable {
  id: number;
  nombre: string;
  modelo: string | null;
  plataforma: string;
  pushHabilitado: boolean;
  activo: boolean;
  ultimoAcceso: string | null;
  vinculadoEn: string;
}

export interface NotificacionWear {
  id: string;
  tipo: TipoNotificacion;
  titulo: string;
  cuerpo: string;
  datos: Record<string, unknown>;
  leida: boolean;
  creadoEn: string;
}
