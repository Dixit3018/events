import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export class MyHttpInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const apis = ["/api/profile-picture","/api/create-event","/api/get-events","/api/update-user"]

    if (apis.some(api => req.url.includes(api))) {
      const user = JSON.parse(localStorage.getItem('user'));

      const modifiedRequest = req.clone({
        setParams: {
          _id: user['_id'],
        },
      });

      return next.handle(modifiedRequest);
    }
    else{
      return next.handle(req);

    }


  }
}
