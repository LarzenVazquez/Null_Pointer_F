import { Injectable } from '@angular/core';

export type EventoTipo =
  | 'navidad'
  | 'anio_nuevo'
  | 'dia_muertos'
  | 'halloween'
  | 'san_valentin'
  | 'default';

export interface EventoCalendario {
  tipo: EventoTipo;
  nombre: string;
  banner: string;
  descripcion: string;
  accentColor: string;
  bgColor: string;
  emoji: string;
}

@Injectable({ providedIn: 'root' })
export class EventoCalendarioService {
  /** Detecta el evento activo según la fecha del sistema */
  getEventoActivo(fecha: Date = new Date()): EventoCalendario {
    const mes = fecha.getMonth() + 1; // 1-12
    const dia = fecha.getDate();

    // Navidad: 20-31 dic
    if (mes === 12 && dia >= 20) return this.eventos['navidad'];

    // Año Nuevo: 1-5 ene
    if (mes === 1 && dia <= 5) return this.eventos['anio_nuevo'];

    // Día de Muertos: 1-2 nov
    if (mes === 11 && dia <= 2) return this.eventos['dia_muertos'];

    // Halloween: 28-31 oct
    if (mes === 10 && dia >= 28) return this.eventos['halloween'];

    // San Valentín: 10-14 feb
    if (mes === 2 && dia >= 10 && dia <= 14)
      return this.eventos['san_valentin'];

    return this.eventos['default'];
  }

  private eventos: Record<EventoTipo, EventoCalendario> = {
    navidad: {
      tipo: 'navidad',
      nombre: 'Navidad',
      banner:
        ' Oferta Navideña — 20% off en reservas del 20 al 31 de diciembre',
      descripcion: 'Celebra con tu banda estas fiestas',
      accentColor: '#00c853',
      bgColor: 'linear-gradient(135deg, #0a1f0a 0%, #0a0a0a 100%)',
      emoji: '',
    },
    anio_nuevo: {
      tipo: 'anio_nuevo',
      nombre: 'Año Nuevo',
      banner: ' Año Nuevo — ¡Estrena el año ensayando con tu banda!',
      descripcion: 'Primer ensayo del año sin costo de reserva',
      accentColor: '#ffd700',
      bgColor: 'linear-gradient(135deg, #1a1500 0%, #0a0a0a 100%)',
      emoji: '',
    },
    dia_muertos: {
      tipo: 'dia_muertos',
      nombre: 'Día de Muertos',
      banner: ' Día de Muertos — Toca para los que ya no están',
      descripcion: 'Noche de ensayo especial 1 y 2 de noviembre',
      accentColor: '#ff6b00',
      bgColor: 'linear-gradient(135deg, #1a0800 0%, #0a0a0a 100%)',
      emoji: '',
    },
    halloween: {
      tipo: 'halloween',
      nombre: 'Halloween',
      banner: ' Halloween — Ensaya de noche, suena de miedo',
      descripcion: 'Tarifa especial nocturna del 28 al 31 de octubre',
      accentColor: '#ff6600',
      bgColor: 'linear-gradient(135deg, #1a0900 0%, #0a0a0a 100%)',
      emoji: '',
    },
    san_valentin: {
      tipo: 'san_valentin',
      nombre: 'San Valentín',
      banner: ' San Valentín — Dedícale una cancion a quien amas',
      descripcion: 'Sala romántica para duo, 14 de febrero',
      accentColor: '#ff1a6e',
      bgColor: 'linear-gradient(135deg, #1a0010 0%, #0a0a0a 100%)',
      emoji: '',
    },
    default: {
      tipo: 'default',
      nombre: '',
      banner: '',
      descripcion: '',
      accentColor: '#c8ff00',
      bgColor: '#0a0a0a',
      emoji: '',
    },
  };
}
