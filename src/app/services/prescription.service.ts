import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prescription, PrescriptionRequest } from '../models/prescription.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  private apiUrl = `${environment.apiUrl}/prescriptions`;

  constructor(private http: HttpClient) { }

  // Doktor kendi reçetelerini listeler
  getByDoctorId(doctorId: number): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  // Hasta kendi reçetelerini listeler
  getByPatientId(patientId: number): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  // Tekil reçete
  getById(id: number): Observable<Prescription> {
    return this.http.get<Prescription>(`${this.apiUrl}/${id}`);
  }

  // Yeni reçete oluştur (doktor) [veya admin yine kontrol et..]
  create(prescription: PrescriptionRequest): Observable<Prescription> {
    return this.http.post<Prescription>(this.apiUrl, prescription);
  }

  // Reçete güncelle (doktor)
  update(id: number, prescription: PrescriptionRequest): Observable<Prescription> {
    return this.http.put<Prescription>(`${this.apiUrl}/${id}`, prescription);
  }

  // Reçete sil (admin veya doktor)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Admin tüm reçeteleri görebilir
  getAll(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(this.apiUrl);
  }
}
