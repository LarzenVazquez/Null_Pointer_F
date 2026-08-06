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

@Injectable({ providedIn: 'root' })
export class EventoCalendarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/eventos`;

  private _today = signal(new Date());
  private _eventoActivo = signal<EventoCalendario>(EVENTO_DEFAULT);
  private _eventosDisponibles = signal<EventoCalendario[]>([]);

  readonly activeEvent = this._eventoActivo.asReadonly();
  readonly eventosDisponibles = this._eventosDisponibles.asReadonly();

  constructor() {
    this.cargarEventoActivo(this._today());
    this.cargarListaEventos();
  }

  setTestDate(date: Date): void {
    this._today.set(date);
    this.cargarEventoActivo(date);
  }

  resetDate(): void {
    this.fijarEventoGlobal(null);
    this.setTestDate(new Date());
  }

  getTodosLosEventos(): EventoCalendario[] {
    return this._eventosDisponibles();
  }

  previewEvento(tipo: EventoTipo): void {
    this.http
      .get<{ ok: boolean; evento: EventoCalendario }>(`${this.apiUrl}/${tipo}`)
      .subscribe({
        next: (res) => this._eventoActivo.set(res.evento),
        error: () => this._eventoActivo.set(EVENTO_DEFAULT),
      });
  }

  fijarEventoGlobal(tipo: EventoTipo | null): void {
    this.http
      .post<{
        ok: boolean;
        evento: EventoCalendario;
      }>(`${this.apiUrl}/fijar`, { tipo })
      .subscribe({
        next: (res) => {
          this._eventoActivo.set(res.evento);
        },
        error: (err) => console.error('Error al fijar evento global', err),
      });
  }

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
