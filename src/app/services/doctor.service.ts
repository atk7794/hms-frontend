import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/doctors`;

  constructor(private http: HttpClient) {}

  // Tüm doktorları getir
  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  // ID ile doktor getir
  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  // Yeni doktor oluştur
  createDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.apiUrl, doctor);
  }

  // Doktor güncelle
  updateDoctor(id: number, doctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/${id}`, doctor);
  }

  // Doktor sil
  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // --- EKLENECEK METODLAR ---

  // Tüm specialities
  getAllSpecialities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/specialities`);
  }

  // Speciality'ye göre doktorları getir
  getDoctorsBySpeciality(speciality: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}?speciality=${speciality}`);
  }


  getDoctorByUserId(userId: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/user/${userId}`);
  }
  
}
