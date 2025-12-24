import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss']
})
export class DoctorListComponent implements OnInit {

  doctors: Doctor[] = [];
  loading = false;
  error = '';
  selectedDoctor: Doctor | null = null; // Güncellenecek doktor

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.fetchDoctors();
  }

  fetchDoctors(): void {
    this.loading = true;
    this.error = '';
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Hata oluştu:', err);
        this.error = 'Doktorlar yüklenirken bir hata oluştu.';
        this.loading = false;
      }
    });
  }

  deleteDoctor(id?: number): void {
    if (!id) return;
    if (!confirm('Bu doktoru silmek istediğinize emin misiniz?')) return;

    this.doctorService.deleteDoctor(id).subscribe({
      next: () => {
        alert('✅ Doktor silindi.');
        this.fetchDoctors(); // Listeyi yenile
      },
      error: (err) => {
        console.error('❌ Silme hatası:', err);
        alert('❌ Silme işlemi başarısız oldu.');
      }
    });
  }

  editDoctor(doctor: Doctor) {
    this.selectedDoctor = doctor;
  }

  onDoctorUpdated() {
    this.selectedDoctor = null; // formu kapat
    this.fetchDoctors(); // listeyi yenile
  }

  clearSelection(): void {
    this.selectedDoctor = null; // Formu sıfırla
  }


}
