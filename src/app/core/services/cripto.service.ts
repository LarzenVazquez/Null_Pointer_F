import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';

const AUTH_URL = `${environment.apiUrl}/auth`;

interface PublicKeyResponse {
  ok: boolean;
  publicKey: string; // PEM, formato SPKI
}

export interface PayloadCifrado {
  encryptedKey: string;
  iv: string;
  ciphertext: string;
}

/**
 * Cifrado híbrido (RSA-OAEP + AES-256-GCM) para el login, espejo del
 * backend en src/utils/hybridCrypto.utils.ts.
 *
 * Por qué "híbrido": RSA (asimétrico) es lento y no cifra datos grandes
 * cómodamente, así que solo se usa para "envolver" (cifrar) una llave
 * AES aleatoria de un solo uso. Esa llave AES es la que realmente cifra
 * el email/password, con AES-GCM (simétrico, rápido, autenticado).
 */
@Injectable({ providedIn: 'root' })
export class CriptoService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private llavePublicaCache: CryptoKey | null = null;

  private async obtenerLlavePublica(): Promise<CryptoKey> {
    if (this.llavePublicaCache) return this.llavePublicaCache;

    const res = await firstValueFrom(
      this.http.get<PublicKeyResponse>(`${AUTH_URL}/public-key`),
    );

    const pemLimpio = res.publicKey
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/\s/g, '');

    const llaveDer = this.base64ABuffer(pemLimpio);

    this.llavePublicaCache = await window.crypto.subtle.importKey(
      'spki',
      llaveDer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt'],
    );

    return this.llavePublicaCache;
  }

  /**
   * Cifra cualquier objeto serializable (en login: { email, password })
   * con el esquema híbrido y regresa lo que hay que mandar al backend.
   */
  async cifrar(datos: unknown): Promise<PayloadCifrado> {
    if (!this.isBrowser) {
      throw new Error(
        'El cifrado híbrido solo puede ejecutarse en el navegador (WebCrypto).',
      );
    }

    const llavePublica = await this.obtenerLlavePublica();

    // 1. Llave simétrica AES-256 efímera (una nueva por cada login).
    const llaveAes = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt'],
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const textoPlano = new TextEncoder().encode(JSON.stringify(datos));

    // 2. Cifra el payload real con AES-GCM (WebCrypto pega el auth tag
    // al final del resultado; el backend lo separa).
    const ciphertextBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      llaveAes,
      textoPlano,
    );

    // 3. Cifra la llave AES con la llave pública RSA del backend.
    const llaveAesRaw = await window.crypto.subtle.exportKey('raw', llaveAes);
    const encryptedKeyBuffer = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      llavePublica,
      llaveAesRaw,
    );

    return {
      encryptedKey: this.bufferABase64(encryptedKeyBuffer),
      iv: this.bufferABase64(iv.buffer),
      ciphertext: this.bufferABase64(ciphertextBuffer),
    };
  }

  private bufferABase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binario = '';
    bytes.forEach((b) => (binario += String.fromCharCode(b)));
    return window.btoa(binario);
  }

  private base64ABuffer(base64: string): ArrayBuffer {
    const binario = window.atob(base64);
    const bytes = new Uint8Array(binario.length);
    for (let i = 0; i < binario.length; i++) {
      bytes[i] = binario.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
