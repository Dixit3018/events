import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  tasks = new BehaviorSubject<{name:string, _id:string, status:string}[]>([]);

  constructor(private http: HttpService) {}

  getAllTasks(userId: string) {
    this.http.getTask(userId).subscribe((data: {message: string, tasks: []}) => {
      if(data.message === 'success'){
          this.tasks.next(data.tasks)
      }
      
    });
  }

}
