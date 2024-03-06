import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private _http: HttpClient) {}

  //get routes
  getUserProfileImg() {
    return this._http.get(`http://localhost:4000/api/profile-picture`);
  }
  getCities() {
    return this._http.get(`http://localhost:4000/api/cities`);
  }
  getEvent() {
    return this._http.get(`http://localhost:4000/api/get-events`);
  }

  getAllEvents() {
    return this._http.get(`http://localhost:4000/api/get-all-events`);
  }

  getVolunteers(userId: string) {
    return this._http.get(
      `http://localhost:4000/api/get-volunteers?userId=${userId}`
    );
  }

  //post routes
  createEvent(eventData: any) {
    return this._http.post(`http://localhost:4000/api/create-event`, eventData);
  }

  singleEvent(id: string) {
    return this._http.post(`http://localhost:4000/api/get-event`, { id: id });
  }

  getOrganizerData(id: string) {
    return this._http.post(`http://localhost:4000/api/get-organizer-data`, {
      id: id,
    });
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

  applyOnEvent(data: {
    event_id: string;
    organizer_id: string;
    volunteer_id: string;
  }) {
    return this._http.post(`http://localhost:4000/api/apply-event`, data);
  }

  getAppliedEvents(data: { id: string }) {
    return this._http.post(
      `http://localhost:4000/api/get-applied-events`,
      data
    );
  }

  getApplicationList(data: { id: string }) {
    return this._http.post(`http://localhost:4000/api/application-list`, data);
  }

  updateApplicationStatus(data: { id: string; status: string }) {
    return this._http.post(
      `http://localhost:4000/api/update-application-status`,
      data
    );
  }
}
