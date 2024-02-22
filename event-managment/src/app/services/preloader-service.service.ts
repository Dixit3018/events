// loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreLoaderService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  showLoader() {
    this.isLoadingSubject.next(true);
  }

  hideLoader() {
    this.isLoadingSubject.next(false);
  }
}
