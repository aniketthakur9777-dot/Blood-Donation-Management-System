import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Donor {

  private apiUrl = 'https://localhost:7144/api/Donors';

  constructor(private http: HttpClient) { }

  // Get All Donors
  getDonors(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Get Donor By Id
  getDonor(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Add Donor
  addDonor(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Update Donor
  updateDonor(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Delete Donor
  deleteDonor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}