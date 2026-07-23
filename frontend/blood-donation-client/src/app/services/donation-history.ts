import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

@Injectable({
  providedIn: 'root'
})
export class DonationHistoryService {
  private apiUrl = `${API_BASE_URL}/DonationHistory`;

  constructor(private http: HttpClient) { }

  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  recordDonation(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  addDonation(data: any): Observable<any> {
    return this.recordDonation(data);
  }
}
