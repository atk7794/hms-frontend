import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserActionLog } from '../models/user-action-log.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserActionLogService {
  private apiUrl = `${environment.apiUrl}/user-actions`;

  constructor(private http: HttpClient) {}

  // 🔹 Tüm logları getir
  getAll(): Observable<UserActionLog[]> {
    return this.http.get<UserActionLog[]>(this.apiUrl);
  }

  // 🔹 Kullanıcı adına göre logları getir
  getByUsername(username: string): Observable<UserActionLog[]> {
    return this.http.get<UserActionLog[]>(`${this.apiUrl}/user/${username}`);
  }

  // 🔹 İşlem türüne göre logları getir
  getByActionType(actionType: string): Observable<UserActionLog[]> {
    return this.http.get<UserActionLog[]>(`${this.apiUrl}/action/${actionType}`);
  }

  // 🔹 Tarih aralığına göre logları getir
  getByDateRange(start: string, end: string): Observable<UserActionLog[]> {
    return this.http.get<UserActionLog[]>(`${this.apiUrl}/between?start=${start}&end=${end}`);
  }

  // 🔹 Manuel log ekleme (örneğin frontend’den tetikleme)
  createLog(username: string, action: string, description: string): Observable<void> {
    return this.http.post<void>(this.apiUrl, { username, action, description });
  }
}
