import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { CryptoService } from '../services/crypto.service';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
  constructor(private alertService: AlertService, private cryptoService: CryptoService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const paramsApis = ['/api/get-single-user','api/get-volunteer'];

    const authApis = [
      '/login',
      '/cities',
      '/signup',
      '/forgot-password',
      '/reset-password/:id/:token',
      '/verify-token',
    ];

    const token = localStorage.getItem('token');
        
    if (token) {
      let modifiedRequest = req;

      const jwtToken = JSON.parse(this.cryptoService.decrypt(token))

      if (paramsApis.some((api) => req.url.includes(api))) {
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

      return next.handle(modifiedRequest);
    } else {
      console.log(req.url);
      
      if (authApis.some((api) => req.url.includes(api))) {
        return next.handle(req);
      } else {
        this.alertService.showAlertRedirect(
          'Unauthorized',
          'You are not authorized to access this resource.',
          'error',
          'green',
          '/login'
        );

        throw new Error('Unauthorized');
      }
    }
  }
}
