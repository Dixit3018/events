import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, exhaustMap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService implements OnInit{
  paymentAmt = new BehaviorSubject<number>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.paymentAmt.subscribe((amount) => {console.log(amount)});
  }

  createPaymentIntent(name:string): Observable<any> {
    return this.paymentAmt.pipe(
      exhaustMap((amount) => {
        return this.http.post(`${environment.apiUrl}/create-payment-intent`, {
          amount,
          name
        });
      })
    );
  }

  setPaymentAmount(amount: number): void {
    this.paymentAmt.next(amount);
  }
}
