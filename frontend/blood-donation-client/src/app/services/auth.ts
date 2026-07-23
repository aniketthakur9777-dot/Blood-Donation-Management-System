import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from './api-config';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = `${API_BASE_URL}/Auth`;
  
  currentUserSignal = signal<{ fullName: string; roleId: number; userId: number } | null>(this.getUserFromStorage());

  constructor(private http: HttpClient) { }

  private getUserFromStorage() {
    const fullName = localStorage.getItem('fullName');
    const roleId = localStorage.getItem('roleId');
    const userId = localStorage.getItem('userId');
    if (fullName && roleId && userId) {
      return { fullName, roleId: Number(roleId), userId: Number(userId) };
    }
    return null;
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId.toString());
          localStorage.setItem('fullName', response.fullName);
          localStorage.setItem('roleId', response.roleId.toString());

          this.currentUserSignal.set({
            fullName: response.fullName,
            roleId: response.roleId,
            userId: response.userId
          });
        }
      })
    );
  }

  logout() {
    localStorage.clear();
    this.currentUserSignal.set(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return localStorage.getItem('roleId') === '1';
  }
}
