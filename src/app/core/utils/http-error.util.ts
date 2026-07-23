import { HttpErrorResponse } from '@angular/common/http';

/**
 * Extrae un mensaje de error legible para mostrar al usuario a partir de
 * cualquier error capturado en un `catch`, sin importar su origen.
 *
 * Importante: `HttpErrorResponse` (lo que lanza `HttpClient` en cualquier
 * respuesta 4xx/5xx) NO extiende la clase nativa `Error` de JavaScript,
 * así que un simple `err instanceof Error` siempre es `false` para errores
 * de red/HTTP y termina ocultando el mensaje real que manda el backend
 * (ej. "Correo o contraseña incorrectos", "Ese correo ya está registrado",
 * "Demasiados intentos fallidos..."). Esta función cubre ese caso primero.
 */
export function mensajeDeError(
  err: unknown,
  fallback = 'Ocurrió un error inesperado. Intenta de nuevo.',
): string {
  if (err instanceof HttpErrorResponse) {
    // El backend siempre responde { ok: false, mensaje, detalles? } (ver
    // error.middleware.ts). Si por alguna razón no hay red (status 0),
    // err.error no trae ese cuerpo y usamos el fallback.
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
