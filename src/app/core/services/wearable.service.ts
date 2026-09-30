import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DispositivoWearable,
  NotificacionWear,
  TipoNotificacion,
} from '@models/wearable.model';

const WEAR_URL = `${environment.apiUrl}/wearable`;
const NOTIF_URL = `${environment.apiUrl}/notificaciones`;

/** Vinculación del reloj (Null Pointer Wear) y consulta de avisos desde la web. */
@Injectable({ providedIn: 'root' })
export class WearableService {
  private http = inject(HttpClient);

  readonly dispositivos = signal<DispositivoWearable[]>([]);
  readonly notificaciones = signal<NotificacionWear[]>([]);
  readonly noLeidas = signal(0);

  async cargarDispositivos(): Promise<void> {
    const res = await firstValueFrom(
      this.http.get<{ ok: boolean; dispositivos: DispositivoWearable[] }>(
        `${WEAR_URL}/dispositivos`,
      ),
    );
    this.dispositivos.set(res.dispositivos);
  }

  /** Confirma el código de 6 dígitos que aparece en la pantalla del reloj. */
  async confirmarCodigo(codigo: string): Promise<string> {
    const res = await firstValueFrom(
      this.http.post<{ ok: boolean; mensaje: string }>(
        `${WEAR_URL}/vinculacion/confirmar`,
        { codigo },
      ),
    );
    return res.mensaje;
  }

  async desvincular(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${WEAR_URL}/dispositivos/${id}`));
    this.dispositivos.update((lista) => lista.filter((d) => d.id !== id));
  }

  async enviarPrueba(tipo: TipoNotificacion): Promise<NotificacionWear> {
    const res = await firstValueFrom(
      this.http.post<{ ok: boolean; notificacion: NotificacionWear }>(
        `${WEAR_URL}/prueba`,
        { tipo },
      ),
    );
    this.notificaciones.update((l) => [res.notificacion, ...l].slice(0, 20));
    this.noLeidas.update((n) => n + 1);
    return res.notificacion;
  }

  async cargarNotificaciones(limite = 20): Promise<void> {
    const res = await firstValueFrom(
      this.http.get<{
        ok: boolean;
        notificaciones: NotificacionWear[];
        noLeidas: number;
      }>(`${NOTIF_URL}?limite=${limite}`),
    );
    this.notificaciones.set(res.notificaciones);
    this.noLeidas.set(res.noLeidas);
  }

  async marcarTodasLeidas(): Promise<void> {
    await firstValueFrom(this.http.patch(`${NOTIF_URL}/leidas`, {}));
    this.notificaciones.update((l) => l.map((n) => ({ ...n, leida: true })));
    this.noLeidas.set(0);
  }
}
