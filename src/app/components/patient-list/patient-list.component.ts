import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  loading = true;
  error: string | null = null;

  selectedPatient?: Patient;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Hasta listesi yüklenirken hata oluştu.';
        this.loading = false;
      }
    });
  }

deletePatient(id?: number) {
  if (!id) return;
  if (!confirm('Bu hastayı silmek istediğinize emin misiniz?')) return;

  this.patientService.deletePatient(id).subscribe({
    next: () => {
      alert('Hasta silindi.');

      // local listeden anında kaldır
      this.patients = this.patients.filter(p => p.id !== id);

      // ve backend’den güncel listeyi yeniden çek
      this.loadPatients();
    },
    error: (err) => {
      console.error('Silme hatası:', err);
      alert('Silme işlemi başarısız oldu.');
    }
  });
}

  editPatient(patient: Patient) {
    this.selectedPatient = patient; // PatientFormComponent'e gönder
  }

  onFormSubmitted() {
    // Form submit edildiğinde listeyi yenile
    this.selectedPatient = undefined; // Formu resetle
    this.loadPatients();
  }
}
