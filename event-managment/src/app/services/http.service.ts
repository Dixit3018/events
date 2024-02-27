import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private _http: HttpClient) {}

  getUserProfileImg() {
    return this._http.get(`http://localhost:4000/api/profile-picture`);
  }
  getCities() {
    return this._http.get(`http://localhost:4000/api/cities`);
  }

  createEvent(eventData: any) {
    return this._http.post(`http://localhost:4000/api/create-event`, eventData);
  }

  getEvent() {
    return this._http.get(`http://localhost:4000/api/get-events`);
  }

  singleEvent(id: string) {
    return this._http.post(`http://localhost:4000/api/get-event`, { id: id });
  }

  updateUser(userData: any) {
    return this._http.post(`http://localhost:4000/api/update-user`, userData);
  }

  updateProfileImg(formData: any) {
    return this._http.post(
      `http://localhost:4000/api/update-profile-img`,
      formData
    );
  }

  forgotPassword(email: string) {
    return this._http.post(`http://localhost:4000/api/forgot-password`, {
      email: email,
    });
  }

  resetPassword(password: string) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    return this._http.post(
      `http://localhost:4000/api/reset-password/${userId}/${token}`,
      { password: password }
    );
  }
}
