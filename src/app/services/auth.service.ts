import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface LoginResponse {
  id: number;
  email: string;
  role: string;
  token?: string;
  patientId?: number; // 🔹 ekledik
}
// changed

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }


  login(email: string, password: string): Observable<LoginResponse> {
    // username değil, email göndereceğiz
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(user => {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }


  register(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, userData);
  }

  resendVerificationEmail(email: string) {
    return this.http.post(`${environment.apiUrl}/auth/resend-verification?email=${email}`, {});
  }


  logout() {
    const user = localStorage.getItem('user');
    const token = user ? JSON.parse(user).token : null;

    if (token) {
      const sendLogoutLog = () => {
        return this.http.post(`${environment.apiUrl}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      };

      let retries = 0;
      const maxRetries = 3;

      const attempt = () => {
        sendLogoutLog().subscribe({
          next: () => console.log('Logout log sent to backend'),
          error: err => {
            retries++;
            if (retries < maxRetries) {
              console.warn(`Retry logout log attempt ${retries}`);
              attempt();
            } else {
              console.error('Logout log failed after 3 attempts:', err);
            }
          }
        });
      };

      attempt();
    }

    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

//  logout() {
//    const user = localStorage.getItem('user');
//    const token = user ? JSON.parse(user).token : null;
//
//    if (token) {
//      this.http.post(`${environment.apiUrl}/auth/logout`, {}, {
//        headers: { Authorization: `Bearer ${token}` }
//      }).subscribe({
//        next: () => console.log('Logout log sent to backend'),
//        error: err => console.error('Logout log failed:', err)
//      });
//    }
//
//    localStorage.removeItem('user');
//    this.currentUserSubject.next(null);
//    this.router.navigate(['/login']);
//  }

//  logout() {
//    localStorage.removeItem('user');
//    this.currentUserSubject.next(null);
//    this.router.navigate(['/login']);
//  }


  get currentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getUserRole(): string | null {
    return this.currentUser?.role || null;
  }
}
