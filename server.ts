import { APP_BASE_HREF } from '@angular/common';
import { AngularNodeAppEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import bootstrap from './src/main.server';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  const angularApp = new AngularNodeAppEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Servir archivos estáticos del navegador
  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: 'index.html',
    }),
  );

  // Manejar todas las demás peticiones con el motor de SSR de Angular
  server.get('**', (req, res, next) => {
    angularApp
      .handle(req)
      .then((response: Response | null) => {
        if (response) {
          writeResponseToNodeResponse(response, res);
        } else {
          next();
        }
      })
      .catch((err: unknown) => next(err));
  });

  return server;
}

function writeResponseToNodeResponse(
  angularResponse: Response,
  nodeResponse: express.Response,
): void {
  nodeResponse.status(angularResponse.status);
  angularResponse.headers.forEach((value, key) => {
    nodeResponse.setHeader(key, value);
  });
  angularResponse.text().then((html: string) => {
    nodeResponse.send(html);
  });
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
