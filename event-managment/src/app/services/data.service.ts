import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BehaviorSubject, Subject, of } from 'rxjs';
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

  getAllTasks(userId: string) {
    this.http
      .getTask().subscribe((data: { message: string; tasks: any[] }) => {
        if (data.message === 'success') {
          this.tasks.next(data.tasks);
        }
        if (data.message == undefined) {
          this.tasks.next([]);
        }
      });
  }
}
