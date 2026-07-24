import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';

const ADMIN_URL = `${environment.apiUrl}/admin`;

export interface ResultadoUsuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  roles: string[];
  activo: boolean;
}

export interface ResultadoConfiguracion {
  id: number;
  tipo: 'rol' | 'permiso';
  nombre: string;
  descripcion?: string;
}

export interface ResultadoBusquedaGlobal {
  usuarios: ResultadoUsuario[];
  configuracion: ResultadoConfiguracion[];
}

interface BuscarResponse {
  ok: boolean;
  query: string;
  resultados: ResultadoBusquedaGlobal;
}

@Injectable({ providedIn: 'root' })
export class BusquedaService {
  private http = inject(HttpClient);

  async buscar(query: string): Promise<ResultadoBusquedaGlobal> {
    if (!query.trim()) return { usuarios: [], configuracion: [] };

    const res = await firstValueFrom(
      this.http.get<BuscarResponse>(`${ADMIN_URL}/buscar`, {
        params: { q: query },
      }),
    );
    return res.resultados;
  }
}
