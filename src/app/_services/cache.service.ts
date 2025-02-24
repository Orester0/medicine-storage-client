import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, { data: any; expiry: number }>();
  private ttl = 5 * 60 * 1000;

  set(key: string, data: any, ttl: number = this.ttl) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (cached.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  invalidateCache(urlPrefix?: string) {
    if (!urlPrefix) {
      this.clear();
      return;
    }

    this.cache.forEach((_, key) => {
      if (key.startsWith(urlPrefix)) {
        this.cache.delete(key);
      }
    });
  }

  clear() {
    this.cache.clear();
  }
}
