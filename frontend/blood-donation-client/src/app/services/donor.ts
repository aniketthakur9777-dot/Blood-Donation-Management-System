import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

@Injectable({
  providedIn: 'root'
})
export class Donor {
  private apiUrl = `${API_BASE_URL}/Donors`;

  constructor(private http: HttpClient) { }

  getDonors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getDonor(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addDonor(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateDonor(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteDonor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}