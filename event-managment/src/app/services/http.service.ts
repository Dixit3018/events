import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private _http: HttpClient,
    private cryptoService: CryptoService
  ) {}
  baseUrl = 'http://localhost:4000/api';

  //==========================================
  //============== Get Requests
  //==========================================

  getDashboardData() {
    return this._http.get(`${this.baseUrl}/dashboard-data`);
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

  getVolunteers() {
    return this._http.get(`${this.baseUrl}/get-volunteers`);
  }

  getSingleUser(id: string) {
    return this._http.get(`${this.baseUrl}/get-single-user?id=${id}`);
  }

  getTask() {
    return this._http.get(`${this.baseUrl}/get-task`);
  }

  getAppliedEvents() {
    return this._http.get(`${this.baseUrl}/get-applied-events`);
  }

  getApplicationList() {
    return this._http.get(`${this.baseUrl}/application-list`);
  }

  getUsers() {
    return this._http.get(`${this.baseUrl}/get-users`);
  }

  getActivity() {
    return this._http.get(`${this.baseUrl}/get-activity`);
  }
  getCompletedEvents() {
    return this._http.get(`${this.baseUrl}/get-completed-events`);
  }

  getEventFeedbacks(eventId:string) {
    return this._http.get(`${this.baseUrl}/get-event-feedbacks?eventId=${eventId}`);
  }
  
  getFeedback(eventId:string) {
    return this._http.get(`${this.baseUrl}/get-feedback?eventId=${eventId}`);
  }

  //=================================================================
  //=============================== Post Requests
  //=================================================================

  createEvent(eventData: any) {
    return this._http.post(`${this.baseUrl}/create-event`, eventData);
  }

  singleEvent(event_id: string) {
    return this._http.post(`${this.baseUrl}/get-event`, { event_id: event_id });
  }

  getOrganizerData(organizer_id: string) {
    return this._http.post(`${this.baseUrl}/get-organizer-data`, {
      organizer_id,
    });
  }

  forgotPassword(email: string) {
    return this._http.post(`${this.baseUrl}/forgot-password`, {
      email: email,
    });
  }

  verifyPasswordResetToken(data: { id: string; token: string }) {
    return this._http.post(`${this.baseUrl}/verify-token`, data);
  }

    resetPassword(id: string, password: string) {
    const token = this.cryptoService.decrypt(JSON.parse(localStorage.getItem('reset-password-token')));      
    return this._http.post(`${this.baseUrl}/reset-password/${id}/${token}`, {
      password: password,
    });
  }

  applyOnEvent(data: { event_id: string; organizer_id: string }) {
    return this._http.post(`${this.baseUrl}/apply-event`, data);
  }

  storeContactForm(data: any) {
    return this._http.post(`${this.baseUrl}/contact-form`, data);
  }

  retriveChatHistory(recipent_id: string) {
    return this._http.post(`${this.baseUrl}/chat-history`, {
      recipent_id: recipent_id,
    });
  }

  trackActivity(timeSpent: number, date: string) {
    return this._http.post(`${this.baseUrl}/track-user-activity`, {
      timeSpent: timeSpent,
      date: date,
    });
  }

  addTask(userId: string, task: string) {
    return this._http.post(`${this.baseUrl}/add-task`, {
      userId: userId,
      task: task,
    });
  }

  giveFeedbackToVolunteer(
    feedback: { rate: number; userId: string; eventId: string; role: string }[]
  ) {
    return this._http.post(`${this.baseUrl}/feedback-to-volunteer`, {
      feedback: feedback,
    });
  }

  //========================================
  //=================== Put requests
  //========================================

  updateUser(userData: any) {
    return this._http.put(`${this.baseUrl}/update-user`, userData);
  }
  
  createMsgInstance(recieverId: string) {
    return this._http.put(`${this.baseUrl}/create-message-instance`, {recieverId:recieverId});
  }

  updateTaskStatus(userId: string, taskId: string) {
    return this._http.put(`${this.baseUrl}/update-status`, { userId, taskId });
  }

  updateProfileImg(formData: any) {
    return this._http.put(`${this.baseUrl}/update-profile-img`, formData);
  }

  updateApplicationStatus(data: {
    application_id: string;
    status: string;
    volunteer_id: string;
  }) {
    return this._http.put(`${this.baseUrl}/update-application-status`, data);
  }
}
