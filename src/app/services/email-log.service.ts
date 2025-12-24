import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EmailLog {
  id: number;
  recipient: string;
  subject: string;
  success: boolean;
  errorMessage: string;
  sentAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailLogService {
  private apiUrl = `${environment.apiUrl}/email-logs`;

  constructor(private http: HttpClient) {}

  getAllLogs(): Observable<EmailLog[]> {
    return this.http.get<EmailLog[]>(this.apiUrl);
  }
}
