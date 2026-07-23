import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${API_BASE_URL}/BloodInventory`;

  constructor(private http: HttpClient) { }

  getInventory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateInventory(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  addOrUpdateInventory(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateUnits(bloodGroup: string, unitsAvailable: number): Observable<any> {
    return this.addOrUpdateInventory({ bloodGroup, unitsAvailable });
  }
}
