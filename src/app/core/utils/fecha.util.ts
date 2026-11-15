/**
 * Fecha local de hoy en formato AAAA-MM-DD.
 * No usar `toISOString()`: devuelve la fecha en UTC, y en México a partir de las 18:00
 * ya marca el día siguiente.
 */
export function hoyLocal(fecha: Date = new Date()): string {
  const a = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${a}-${m}-${d}`;
}
