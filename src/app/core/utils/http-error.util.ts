import { HttpErrorResponse } from '@angular/common/http';

export function mensajeDeError(
  err: unknown,
  fallback = 'Ocurrió un error inesperado. Intenta de nuevo.',
): string {
  if (err instanceof HttpErrorResponse) {

    const mensajeBackend = (err.error as { mensaje?: string } | null)
      ?.mensaje;
    if (mensajeBackend) return mensajeBackend;
    if (err.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión.';
    }
    return fallback;
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return fallback;
}
