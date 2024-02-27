import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  userProfileImg = new BehaviorSubject<String>(null);

  constructor(private _http: HttpClient) {}

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
}
