// src/app/services/evento-calendario.service.ts
import { Injectable } from '@angular/core';

export type EventoTipo =
  | 'default'
  | 'navidad'
  | 'anio_nuevo'
  | 'dia_muertos'
  | 'halloween'
  | 'san_valentin';

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
  private eventos: Record<EventoTipo, EventoCalendario> = {
    navidad: {
      tipo: 'navidad',
      nombre: 'Navidad',
      banner:
        '🎄 Oferta Navideña — 20% off en ensayos del 20 al 31 de diciembre',
      descripcion: 'Toca villancicos en nuestras salas esta temporada.',
      accentColor: '#00C853',
      bgColor: 'linear-gradient(135deg, #001a00 0%, #003300 100%)',
      emoji: '🎄',
    },
    anio_nuevo: {
      tipo: 'anio_nuevo',
      nombre: 'Año Nuevo',
      banner: '🥂 Año Nuevo — ¡Estrena el año tocando con tu banda!',
      descripcion: 'Empieza el año con el pie derecho... y con tu instrumento.',
      accentColor: '#FFD700',
      bgColor: 'linear-gradient(135deg, #1a1400 0%, #332800 100%)',
      emoji: '🥂',
    },
    dia_muertos: {
      tipo: 'dia_muertos',
      nombre: 'Día de Muertos',
      banner: '💀 Día de Muertos — Toca para los que ya no están',
      descripcion: 'Honra a quienes te enseñaron a amar la música.',
      accentColor: '#FF6B00',
      bgColor: 'linear-gradient(135deg, #1a0800 0%, #2d1200 100%)',
      emoji: '💀',
    },
    halloween: {
      tipo: 'halloween',
      nombre: 'Halloween',
      banner: '🎃 Halloween — Ensaya de noche, suena de miedo',
      descripcion: 'Las mejores sesiones ocurren en la oscuridad.',
      accentColor: '#FF6600',
      bgColor: 'linear-gradient(135deg, #0d0500 0%, #1a0a00 100%)',
      emoji: '🎃',
    },
    san_valentin: {
      tipo: 'san_valentin',
      nombre: 'San Valentín',
      banner: '💖 San Valentín — Dedícale una canción a quien amas',
      descripcion: 'La música es el mejor regalo. Reserva una sala para dos.',
      accentColor: '#FF1A6E',
      bgColor: 'linear-gradient(135deg, #1a0010 0%, #2d0020 100%)',
      emoji: '💖',
    },
    default: {
      tipo: 'default',
      nombre: '',
      banner: '',
      descripcion: 'Salas de ensayo profesionales con acústica de estudio.',
      accentColor: '#C8FF00',
      bgColor: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      emoji: '',
    },
  };

  /**
   * Retorna el EventoCalendario activo según la fecha dada (por defecto hoy).
   * Coincide con la lógica documentada en el PDF (práctica 6, sección 2.2).
   */
  getEventoActivo(fecha: Date = new Date()): EventoCalendario {
    const mes = fecha.getMonth() + 1; // 1-12
    const dia = fecha.getDate();

    // Navidad: 20-31 diciembre
    if (mes === 12 && dia >= 20) return this.eventos['navidad'];

    // Año Nuevo: 1-5 enero
    if (mes === 1 && dia <= 5) return this.eventos['anio_nuevo'];

    // Día de Muertos: 1-2 noviembre
    if (mes === 11 && dia <= 2) return this.eventos['dia_muertos'];

    // Halloween: 28-31 octubre
    if (mes === 10 && dia >= 28) return this.eventos['halloween'];

    // San Valentín: 10-14 febrero
    if (mes === 2 && dia >= 10 && dia <= 14)
      return this.eventos['san_valentin'];

    return this.eventos['default'];
  }
}
