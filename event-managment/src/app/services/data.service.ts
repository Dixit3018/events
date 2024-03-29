import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  tasks = new BehaviorSubject<{ name: string; _id: string; status: string }[]>(
    []
  );
  feedbackChanged = new Subject<boolean>();

  onUserImageChange = new Subject<string>();

  constructor(private http: HttpService) {}

  userImageChange(img:string){
    this.onUserImageChange.next(img)
  }
  private handelerror(error: HttpErrorResponse) {
    if(error.status === 404) {
      console.log('No tasks found');
      return false;
    }else {
      console.log('error occured');
      return false;
    }
  }

  getAllTasks(userId: string) {
    this.http
      .getTask().pipe(catchError(error => of(this.handelerror(error))))
      .subscribe((data: { message: string; tasks: any[] }) => {
        if (data.message === 'success') {
          this.tasks.next(data.tasks);
        }
      });
  }
}
