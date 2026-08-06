export type ServicioTipo = 'grabacion' | 'mastering' | 'entrega_masters';

export interface ServicioAdicional {
  id: ServicioTipo;
  nombre: string;
  descripcion: string;
  precio: number;
  unidad: string;
  icono: string;
  detalles: string[];

  requiereCantidad: boolean;
  cantidadLabel?: string;
}
