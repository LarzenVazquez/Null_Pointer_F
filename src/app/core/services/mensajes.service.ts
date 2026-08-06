import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { Mensaje, MensajeEstado, MensajeOrigen, NuevoMensajePayload } from '@models/mensaje.model';

const API_URL = `${environment.apiUrl}/mensajes`;

@Injectable({ providedIn: 'root' })
export class MensajesService {
  private http = inject(HttpClient);

  async enviarMensaje(payload: NuevoMensajePayload): Promise<Mensaje> {
    const res = await firstValueFrom(
      this.http.post<{ ok: boolean; mensaje: Mensaje }>(API_URL, payload),
    );
    return res.mensaje;
  }

  async getMensajes(origen?: MensajeOrigen): Promise<Mensaje[]> {
    const res = await firstValueFrom(
      this.http.get<{ ok: boolean; mensajes: Mensaje[] }>(API_URL, {
        params: origen ? { origen } : {},
      }),
    );
    return res.mensajes;
  }

  async marcarComo(id: string, estado: MensajeEstado): Promise<Mensaje> {
    const res = await firstValueFrom(
      this.http.patch<{ ok: boolean; mensaje: Mensaje }>(
        `${API_URL}/${id}/estado`,
        { estado },
      ),
    );
    return res.mensaje;
  }
}
