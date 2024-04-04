import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';
import { CryptoService } from '../services/crypto.service';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
  private readonly paramsApis = ['/api/get-single-user', '/api/get-volunteer'];
  private readonly openApis = [
    '/login',
    '/cities',
    '/register',
    '/forgot-password',
    '/reset-password/:id/:token',
    '/verify-token',
    '/contact-form',
    '/homepage-details'
  ];

  constructor(
    private alertService: AlertService,
    private cryptoService: CryptoService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token') ?? null;

    // Allow requests to reset-password endpoint without token
    if (req.url.includes('/reset-password/')) {
      return next.handle(req);
    }
    
    if (token) {
      const jwtToken = JSON.parse(this.cryptoService.decrypt(token));

      let modifiedRequest = req;

      if (this.paramsApis.some((api) => req.url.includes(api))) {
        const user = JSON.parse(localStorage.getItem('user'));
        modifiedRequest = req.clone({
          setParams: { _id: user ? user._id : '' },
          setHeaders: { Authorization: `Bearer ${jwtToken}` },
        });
      } else {
        modifiedRequest = req.clone({
          setHeaders: { Authorization: `Bearer ${jwtToken}` },
        });
      }

      return next.handle(modifiedRequest).pipe(
        catchError((error) => {
          if (error.status === 401) {
            this.handleUnauthorized();
          }
          throw error;
        })
      );
    } else {
      if (this.isAuthApi(req.url)) {
        return next.handle(req);
      } else {
        this.handleUnauthorized();
        throw new Error('Unauthorized');
      }
    }
  }

  private isAuthApi(url: string): boolean {
    return this.openApis.some((api) => url.includes(api));
  }

  private handleUnauthorized(): void {
    this.alertService.showAlertRedirect(
      'Unauthorized',
      'You are not authorized to access this resource.',
      'error',
      'green',
      '/login'
    );
  }
}
