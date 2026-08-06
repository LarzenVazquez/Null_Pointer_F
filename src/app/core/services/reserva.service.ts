import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { NuevaReservaPayload, Reserva } from '@models/reserva.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

const API_URL = `${environment.apiUrl}/reservas`;

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private misReservasSig = signal<Reserva[]>([]);
  private todasReservasSig = signal<Reserva[]>([]);

  constructor() {
    if (this.isBrowser) {
      effect(() => {
        const user = this.authService.currentUser();
        if (!user) {
          this.misReservasSig.set([]);
          this.todasReservasSig.set([]);
          return;
        }

        this.cargarMisReservas();
        if (user.roles.includes('Administrador') || user.roles.includes('Editor')) {
          this.cargarTodasLasReservas();
        }
      });
    }
  }

  private async cargarMisReservas(): Promise<void> {
    const res = await firstValueFrom(
      this.http.get<{ ok: boolean; reservas: Reserva[] }>(API_URL),
    );
    this.misReservasSig.set(res.reservas);
  }

  private async cargarTodasLasReservas(): Promise<void> {
    const res = await firstValueFrom(
      this.http.get<{ ok: boolean; reservas: Reserva[] }>(`${API_URL}/todas`),
    );
    this.todasReservasSig.set(res.reservas);
  }

  getReservasDeUsuario(_usuarioId: string): Reserva[] {
    return this.misReservasSig();
  }

  getAllReservas(): Reserva[] {
    return this.todasReservasSig();
  }

  getReservaById(id: string): Reserva | undefined {
    return (
      this.misReservasSig().find((r) => r.id === id) ??
      this.todasReservasSig().find((r) => r.id === id)
    );
  }

  async crearReserva(payload: NuevaReservaPayload): Promise<Reserva> {
    const { usuarioId: _usuarioId, ...body } = payload;
    const res = await firstValueFrom(
      this.http.post<{ ok: boolean; reserva: Reserva }>(API_URL, body),
    );
    this.misReservasSig.update((reservas) => [res.reserva, ...reservas]);
    return res.reserva;
  }

  async actualizarEstado(id: string, estado: Reserva['estado']): Promise<void> {
    const res = await firstValueFrom(
      this.http.patch<{ ok: boolean; reserva: Reserva }>(`${API_URL}/${id}/estado`, { estado }),
    );
    this.actualizarEnCache(res.reserva);
  }

  async cancelarReserva(id: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.patch<{ ok: boolean; reserva: Reserva }>(`${API_URL}/${id}/cancelar`, {}),
    );
    this.actualizarEnCache(res.reserva);
  }

  private actualizarEnCache(reserva: Reserva): void {
    this.misReservasSig.update((reservas) =>
      reservas.map((r) => (r.id === reserva.id ? reserva : r)),
    );
    this.todasReservasSig.update((reservas) =>
      reservas.map((r) => (r.id === reserva.id ? reserva : r)),
    );
  }
}
