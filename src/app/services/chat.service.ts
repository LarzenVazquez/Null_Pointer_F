import { Injectable } from '@angular/core';

export interface ChatMessage {
  text: string;
  type: 'studio' | 'user';
  time: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private responses: Record<string, string> = {
    precio:
      '$150 MXN/h Sala A, $110 MXN/h Sala B, $80 MXN/h Sala C. Paquete jornada 8h por $500 MXN.',
    sala:
      'Tenemos 3 salas: Sala A (6 musicos, 40m2), Sala B (4 musicos, 28m2) y Sala C (3 musicos, 18m2). Cada una con equipo profesional incluido.',
    horario:
      'Estamos disponibles las 24 horas del dia, los 7 dias de la semana.',
    reserva:
      'Puedes reservar desde el formulario en la seccion de Reserva en linea, o dinos aqui que sala y fecha necesitas.',
    bateria:
      'Sala A: Pearl Export Pro con platillos Zildjian. Sala B: Mapex Saturn. Sala C: Pearl Roadshow.',
    equipo:
      'Todas las salas incluyen bateria, amplificadores Marshall y Ampeg. Sala B agrega mesa Behringer X32.',
    ubicacion:
      'Estamos en Queretaro, Qro. Escribenos al chat y te mandamos la direccion exacta.',
    contacto:
      'Puedes escribirnos aqui mismo o al correo contacto@nullpointer.mx. Tambien estamos en Instagram.',
  };

  private fallbacks: string[] = [
    'Claro, con gusto te ayudamos. Puedes darnos mas detalle?',
    'Recibimos tu mensaje. En unos momentos te respondemos.',
    'Gracias por escribirnos. Un agente te atendera enseguida.',
    'Entendido. Estamos revisando tu consulta ahora mismo.',
  ];

  getReply(text: string): string {
    const lower = text.toLowerCase();
    for (const key of Object.keys(this.responses)) {
      if (lower.includes(key)) return this.responses[key];
    }
    return this.fallbacks[Math.floor(Math.random() * this.fallbacks.length)];
  }

  getTimeStr(): string {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
}
