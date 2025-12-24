// src/app/services/medical-record.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicalRecord, MedicalRecordRequest } from '../models/medical-record.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private api = `${environment.apiUrl}/medical-records`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(this.api);
  }

  getRecordById(id: number): Observable<MedicalRecord> {
    return this.http.get<MedicalRecord>(`${this.api}/${id}`);
  }

  getByPatient(patientId: number): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${this.api}/patient/${patientId}`);
  }

  // ✅ Doctor kendi hastalarının kayıtlarını alacak
  getByDoctor(doctorId: number): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${this.api}/doctor/${doctorId}`);
  }

  create(dto: MedicalRecordRequest): Observable<MedicalRecord> {
    return this.http.post<MedicalRecord>(this.api, dto);
  }

  update(id: number, dto: MedicalRecordRequest): Observable<MedicalRecord> {
    return this.http.put<MedicalRecord>(`${this.api}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
