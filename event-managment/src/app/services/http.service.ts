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

  updateProfileImg(formData:any) {
    return this._http.post(
      `http://localhost:4000/api/update-profile-img`,
      formData
    );
  }
}
