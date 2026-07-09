import { Injectable } from '@angular/core';
import { ServicioAdicional, ServicioTipo } from '@models/servicio.model';

/**
 * Catálogo de servicios de producción (adicionales a la renta de sala).
 * TODO(API): reemplazar por this.http.get<ServicioAdicional[]>('/api/servicios').
 */
@Injectable({ providedIn: 'root' })
export class ServiciosService {
  private servicios: ServicioAdicional[] = [
    {
      id: 'grabacion',
      nombre: 'Grabación de audio',
      descripcion:
        'Sesión de grabación multipista con ingeniero de audio, microfonía profesional y monitoreo en cabina de control.',
      precio: 350,
      unidad: 'por hora',
      icono: '●REC',
      requiereCantidad: false,
      detalles: [
        'Ingeniero de grabación incluido',
        'Microfonía profesional (dinámicos y condensador)',
        'Grabación multipista sincronizada',
        'Entrega de sesión en bruto',
      ],
    },
    {
      id: 'mastering',
      nombre: 'Mastering',
      descripcion:
        'Masterización profesional por pista para llevar tu mezcla a estándar de distribución (streaming, radio, vinilo).',
      precio: 450,
      unidad: 'por pista',
      icono: '≡EQ',
      requiereCantidad: true,
      cantidadLabel: 'Número de pistas a masterizar',
      detalles: [
        'Ecualización y compresión de master',
        'Normalización de loudness (streaming-ready)',
        'Hasta 2 rondas de revisión',
        'Entrega en WAV 24-bit y MP3 320kbps',
      ],
    },
    {
      id: 'entrega_masters',
      nombre: 'Entrega de masters',
      descripcion:
        'Exportación y entrega de archivos WAV finales por pista, listos para distribución digital o prensado físico.',
      precio: 80,
      unidad: 'por pista',
      icono: '↓WAV',
      requiereCantidad: true,
      cantidadLabel: 'Número de pistas a entregar',
      detalles: [
        'Archivo WAV 24-bit/48kHz por pista',
        'Nomenclatura y metadata lista para distribución',
        'Entrega vía enlace de descarga privado',
        'Respaldo disponible 90 días',
      ],
    },
  ];

  getServicios(): ServicioAdicional[] {
    return this.servicios;
  }

  getServicioById(id: ServicioTipo): ServicioAdicional | undefined {
    return this.servicios.find((s) => s.id === id);
  }
}
