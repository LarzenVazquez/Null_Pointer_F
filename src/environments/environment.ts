import { isDevMode } from '@angular/core';

const PRODUCTION_API_URL = 'https://tu-dominio-de-produccion.com/api';
const DEVELOPMENT_API_URL = 'http://localhost:3000/api';

export const environment = {
  production: !isDevMode(),
  apiUrl: isDevMode() ? DEVELOPMENT_API_URL : PRODUCTION_API_URL,
};
