import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { Appointment } from '../../models/appointment.model';
import { MedicalRecordService } from '../../services/medical-record.service';
import { MedicalRecord } from '../../models/medical-record.model';
import { ActivatedRoute, Router } from '@angular/router'; // ✅ EKLENDİ

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss']
})
export class PatientDashboardComponent implements OnInit {

  // patient-dashboard.component.ts
  activeTab: 'appointments' | 'medicalRecords' | 'prescriptions' = 'appointments';
  user: any;

  appointments: Appointment[] = [];
  patientId!: number;
  selectedAppointment?: Appointment; // Düzenleme / Form toggle
  showForm = false; // Form görünürlük

  // medical records
  medicalRecords: MedicalRecord[] = [];
  selectedRecord?: MedicalRecord;
  showRecordView = false;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private medicalRecordService: MedicalRecordService,
    private route: ActivatedRoute,      // ✅ EKLENDİ
    private router: Router              // ✅ EKLENDİ
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    if (this.user) {
      this.patientId = this.user.patientId ?? this.user.id;
      this.loadAppointments();
      this.loadMedicalRecords();
    }

    // 🔹 URL'den aktif sekmeyi al
    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab') as typeof this.activeTab;
      if (tab) this.activeTab = tab;
    });
  }

  // 🔹 Sekme değiştirme
  setTab(tab: typeof this.activeTab) {
    this.activeTab = tab;
    this.showForm = false;
    this.showRecordView = false;

    // URL parametresini güncelle
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAppointmentsByPatientId(this.patientId)
      .subscribe({
        next: (res) => this.appointments = res,
        error: (err) => console.error('Randevular yüklenemedi', err)
      });
  }

  deleteAppointment(id?: number): void {
    if (!id) return;
    if (!confirm('Bu randevuyu silmek istediğinize emin misiniz?')) return;

    this.appointmentService.deleteAppointment(id).subscribe({
      next: () => this.loadAppointments(),
      error: (err) => console.error('Randevu silinemedi', err)
    });
  }

  // Form toggle / düzenleme
  openForm(appointment?: Appointment) {
    this.selectedAppointment = appointment ? { ...appointment } : undefined; // Objeyi clone et
    this.showForm = true;
  }

  closeForm() {
    this.selectedAppointment = undefined;
    this.showForm = false;
  }

  onFormSubmitted() {
    this.loadAppointments(); // Listeyi yenile
    this.closeForm();
  }

  loadMedicalRecords(): void {
    this.medicalRecordService.getByPatient(this.patientId)
      .subscribe({
        next: (res) => this.medicalRecords = res,
        error: (err) => console.error('Medical Records yüklenemedi', err)
      });
  }

  viewRecord(record: MedicalRecord) {
    this.selectedRecord = { ...record };
    this.showRecordView = true;
  }

  closeRecordView() {
    this.selectedRecord = undefined;
    this.showRecordView = false;
  }

}





