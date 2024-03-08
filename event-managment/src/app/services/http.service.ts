import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private _http: HttpClient) {}
  baseUrl = 'http://localhost:4000/api';
  
  //get routes
  getUserProfileImg() {
    return this._http.get(`${this.baseUrl}/profile-picture`);
  }
  getCities() {
    return this._http.get(`${this.baseUrl}/cities`);
  }
  getEvent() {
    return this._http.get(`${this.baseUrl}/get-events`);
  }

  getAllEvents() {
    return this._http.get(`${this.baseUrl}/get-all-events`);
  }

  getSingleVolunteer(userId: string) {
    return this._http.get(`${this.baseUrl}/get-volunteer?userId=${userId}`);
  }

  getVolunteers(userId: string) {
    return this._http.get(`${this.baseUrl}/get-volunteers?userId=${userId}`);
  }

  //post routes
  createEvent(eventData: any) {
    return this._http.post(`${this.baseUrl}/create-event`, eventData);
  }

  singleEvent(id: string) {
    return this._http.post(`${this.baseUrl}/get-event`, { id: id });
  }

  getOrganizerData(id: string) {
    return this._http.post(`${this.baseUrl}/get-organizer-data`, {
      id: id,
    });
  }

  updateUser(userData: any) {
    return this._http.post(`${this.baseUrl}/update-user`, userData);
  }

  updateProfileImg(formData: any) {
    return this._http.post(`${this.baseUrl}/update-profile-img`, formData);
  }

  forgotPassword(email: string) {
    return this._http.post(`${this.baseUrl}/forgot-password`, {
      email: email,
    });
  }

  verifyPasswordResetToken(data: {id:string, token:string}) {
    return this._http.post(`${this.baseUrl}/verify-token`,data);
  }

  resetPassword(password: string) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    return this._http.post(
      `${this.baseUrl}/reset-password/${userId}/${token}`,
      { password: password }
    );
  }

  applyOnEvent(data: {
    event_id: string;
    organizer_id: string;
    volunteer_id: string;
  }) {
    return this._http.post(`${this.baseUrl}/apply-event`, data);
  }

  getAppliedEvents(data: { id: string }) {
    return this._http.post(`${this.baseUrl}/get-applied-events`, data);
  }

  getApplicationList(data: { id: string }) {
    return this._http.post(`${this.baseUrl}/application-list`, data);
  }

  updateApplicationStatus(data: { id: string; status: string }) {
    return this._http.post(`${this.baseUrl}/update-application-status`, data);
  }

  storeContactForm(data:any) {
    return this._http.post(`${this.baseUrl}/contact-form`,data);
  }
}
