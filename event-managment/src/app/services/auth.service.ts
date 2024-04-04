import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';

export interface User {
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  age: number;
  address: string;
  city: string;
  state: string;
  role: string;
  profilePicture: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  startTime: number;

  constructor(private _http: HttpClient, private httpService: HttpService) {}

  register(registerData: FormData) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this._http.post('http://localhost:4000/api/register', registerData, {
      headers,
    });
  }

  login(email: string, password: string, role: 'volunteer' | 'organizer') {
    return this._http.post('http://localhost:4000/api/login', {
      email: email,
      password: password,
      role: role,
    });
  }

  startTracking() {
    const storedStartTime = localStorage.getItem('startTime');
    this.startTime = storedStartTime
      ? parseInt(storedStartTime, 10)
      : Date.now();

    if (!storedStartTime) {
      localStorage.setItem('startTime', this.startTime.toString());
    }
  }

  endTracking() {
    const endTime = parseInt(Date.now().toString(), 10) ;
    const startTime = parseInt(localStorage.getItem('startTime') || '',10);

    
    const timeSpentInMilliseconds = endTime - startTime;

    const timeSpentInMinutes = Math.floor(
      timeSpentInMilliseconds / (1000 * 60)
    );

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    // Construct the date string in the format yyyy-mm-dd
    const todayDateString = `${year}-${month}-${day}`;

    this.httpService.trackActivity(timeSpentInMinutes, todayDateString).subscribe();
    localStorage.removeItem('startTime');
  }
}
