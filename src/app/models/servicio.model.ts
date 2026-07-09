export type ServicioTipo = 'grabacion' | 'mastering' | 'entrega_masters';

export interface ServicioAdicional {
  id: ServicioTipo;
  nombre: string;
  descripcion: string;
  precio: number;
  unidad: string;
  icono: string;
  detalles: string[];
  // Si true, el usuario indica una cantidad (p.ej. número de pistas) al agregarlo.
  requiereCantidad: boolean;
  cantidadLabel?: string;
}
