import { HttpInterceptorFn } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { tap } from 'rxjs/internal/operators/tap';
import { CacheService } from '../_services/cache.service';
import { inject } from '@angular/core';

export const cachingInterceptor: HttpInterceptorFn = (req, next) => {
  const cacheService = inject(CacheService);

  const cleanUrl = req.url.split('?')[0];
  const urlParts = cleanUrl.split('/');
  const baseResource = `${urlParts[0]}//${urlParts[2]}/${urlParts[3]}/${urlParts[4]}`;


  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    return next(req).pipe(
      tap(() => {
        cacheService.invalidateCache(cleanUrl); 
        cacheService.invalidateCache(baseResource); 
      })
    );
  }

  if (req.method === 'GET') {
    const cachedResponse = cacheService.get(req.urlWithParams);
    if (cachedResponse) {
      return of(cachedResponse);
    }
  }

  return next(req).pipe(
    tap((event) => {
      if (req.method === 'GET') {
        cacheService.set(req.urlWithParams, event);
      }
    })
  );
};
