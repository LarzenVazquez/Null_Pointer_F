import { isDevMode } from '@angular/core';
export const environment = {
  production: !isDevMode(),
  apiUrl: isDevMode()
    ? 'http://localhost:3000/api'
    : 'https://null-pointer-b.onrender.com/api',
  googleAnalyticsId: 'G-5R0T1W29Y6',
};
