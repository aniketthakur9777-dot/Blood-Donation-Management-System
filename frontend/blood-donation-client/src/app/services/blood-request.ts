import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

@Injectable({
  providedIn: 'root'
})
export class BloodRequestService {
  private apiUrl = `${API_BASE_URL}/BloodRequests`;

  constructor(private http: HttpClient) { }

  getRequests(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getBloodRequests(): Observable<any[]> {
    return this.getRequests();
  }

  getRequest(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createRequest(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, { status });
  }

  deleteRequest(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
