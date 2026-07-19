import { isDevMode } from '@angular/core';

/**
 * Configuración de entorno.
 *
 * No usamos el mecanismo de fileReplacements de Angular (angular.json no
 * lo tiene configurado); en su lugar detectamos el modo con isDevMode(),
 * que Angular ya setea automáticamente según cómo se compile la app
 * (ng serve / ng build --configuration=development => true,
 *  ng build --configuration=production => false).
 *
 * Para producción real, cambia PRODUCTION_API_URL por la URL pública
 * de tu backend desplegado.
 */
const PRODUCTION_API_URL = 'https://tu-dominio-de-produccion.com/api';
const DEVELOPMENT_API_URL = 'http://localhost:3000/api';

export const environment = {
  production: !isDevMode(),
  apiUrl: isDevMode() ? DEVELOPMENT_API_URL : PRODUCTION_API_URL,
};
