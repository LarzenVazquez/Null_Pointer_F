export type MensajeOrigen = 'contacto' | 'soporte';
export type MensajeEstado = 'nuevo' | 'respondido';

export interface Mensaje {
  id: string;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  origen: MensajeOrigen;
  usuarioId?: string;
  estado: MensajeEstado;
  creadoEn: string;
}

export interface NuevoMensajePayload {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  origen: MensajeOrigen;
  usuarioId?: string;
}
