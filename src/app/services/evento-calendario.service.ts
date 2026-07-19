// src/app/services/evento-calendario.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '@environments/environment';

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
  accent2: string;
  bgColor: string;
  surfaceColor: string;
  emoji: string;
  particles: string[];
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}

const EVENTO_DEFAULT: EventoCalendario = {
  tipo: 'default',
  nombre: '',
  banner: '',
  descripcion: 'Salas de ensayo profesionales con acústica de estudio.',
  accentColor: '#C8FF00',
  accent2: '#ff4d00',
  bgColor: '#0a0a0a',
  surfaceColor: '#1a1a1a',
  emoji: '',
  particles: [],
  startMonth: 0,
  startDay: 0,
  endMonth: 0,
  endDay: 0,
};

interface EventoActivoResponse {
  ok: boolean;
  fechaConsultada: string;
  evento: EventoCalendario;
}

interface EventosListResponse {
  ok: boolean;
  eventos: EventoCalendario[];
}

/**
 * Consume la API pública /api/eventos del backend (ver
 * backend/src/services/eventos.service.ts). Reemplaza la versión anterior
 * que tenía los temas hardcodeados en el cliente.
 */
@Injectable({ providedIn: 'root' })
export class EventoCalendarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/eventos`;

  private _today = signal(new Date());
  private _eventoActivo = signal<EventoCalendario>(EVENTO_DEFAULT);
  private _eventosDisponibles = signal<EventoCalendario[]>([]);

  /** Evento activo reactivo (se actualiza cada vez que cambia la fecha simulada). */
  readonly activeEvent = this._eventoActivo.asReadonly();

  /** Lista de todos los temas configurados (para pintar la grilla del panel admin). */
  readonly eventosDisponibles = this._eventosDisponibles.asReadonly();

  constructor() {
    this.cargarEventoActivo(this._today());
    this.cargarListaEventos();
  }

  /** Sobreescribe la fecha para pruebas (barra "Simular fecha" / panel Admin). */
  setTestDate(date: Date): void {
    this._today.set(date);
    this.cargarEventoActivo(date);
  }

  /** Restaura la fecha real del sistema. */
  resetDate(): void {
    this.setTestDate(new Date());
  }

  /** Último listado de eventos conocido (se carga una vez al iniciar el servicio). */
  getTodosLosEventos(): EventoCalendario[] {
    return this._eventosDisponibles();
  }

  /**
   * Usado por el panel de Admin: previsualiza un tema puntual pidiendo
   * su definición completa al backend (GET /api/eventos/:tipo), sin tener
   * que recalcular el rango de fechas en el cliente.
   */
  previewEvento(tipo: EventoTipo): void {
    this.http.get<{ ok: boolean; evento: EventoCalendario }>(
      `${this.apiUrl}/${tipo}`,
    ).subscribe({
      next: (res) => this._eventoActivo.set(res.evento),
      error: () => this._eventoActivo.set(EVENTO_DEFAULT),
    });
  }

  /**
   * Devuelve el último evento activo conocido (valor cacheado del signal).
   * La consulta real al backend es asíncrona: usa `activeEvent` en el
   * template para reactividad, o `setTestDate()` para forzar una nueva
   * consulta con otra fecha.
   */
  getEventoActivo(fecha: Date = new Date()): EventoCalendario {
    return this._eventoActivo();
  }

  private cargarEventoActivo(fecha: Date): void {
    const fechaStr = this.formatearFecha(fecha);
    this.http
      .get<EventoActivoResponse>(`${this.apiUrl}/activo?fecha=${fechaStr}`)
      .subscribe({
        next: (res) => this._eventoActivo.set(res.evento),
        error: () => this._eventoActivo.set(EVENTO_DEFAULT),
      });
  }

  private cargarListaEventos(): void {
    this.http.get<EventosListResponse>(this.apiUrl).subscribe({
      next: (res) => this._eventosDisponibles.set(res.eventos),
      error: () => this._eventosDisponibles.set([]),
    });
  }

  private formatearFecha(fecha: Date): string {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
