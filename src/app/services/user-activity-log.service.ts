import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserActivityLog {
  id: number;
  username: string;
  ipAddress: string;
  loginAt: string;
  logoutAt?: string | null;   // ⬅️ null da olabiliyor
  duration?: number | string; // ⬅️ bazen string geliyor

  // frontend sadece görüntüleme için
  durationSeconds?: number;
  durationFormatted?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserActivityLogService {
  private apiUrl = `${environment.apiUrl}/user-activity-logs`; // Backend endpoint

  constructor(private http: HttpClient) {}

  getAllLogs(): Observable<UserActivityLog[]> {
    return this.http.get<UserActivityLog[]>(this.apiUrl);
  }
}
