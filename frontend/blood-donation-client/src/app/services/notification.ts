import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${API_BASE_URL}/Notifications`;

  constructor(private http: HttpClient) { }

  getNotifications(userId?: number): Observable<any[]> {
    const url = userId ? `${this.apiUrl}?userId=${userId}` : this.apiUrl;
    return this.http.get<any[]>(url);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/read`, {});
  }
}
