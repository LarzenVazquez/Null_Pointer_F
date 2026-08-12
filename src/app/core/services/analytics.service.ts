import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '@environments/environment';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private yaInicializado = false;

  init(): void {
    if (!this.isBrowser) return;
    if (!environment.googleAnalyticsId) return;
    if (this.yaInicializado) return;
    this.yaInicializado = true;

    this.cargarScriptGtag();
    this.escucharCambiosDeRuta();
  }

  private cargarScriptGtag(): void {
    const id = environment.googleAnalyticsId;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: false });
  }

  private escucharCambiosDeRuta(): void {
    this.enviarPageView(this.router.url);

    this.router.events
      .pipe(
        filter(
          (evento): evento is NavigationEnd => evento instanceof NavigationEnd,
        ),
      )
      .subscribe((evento) => this.enviarPageView(evento.urlAfterRedirects));
  }

  private enviarPageView(ruta: string): void {
    window.gtag?.('event', 'page_view', {
      page_path: ruta,
      page_title: document.title,
      page_location: window.location.href,
    });
  }
}
