import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { PatientService } from '../../services/patient.service';
import { DoctorService } from '../../services/doctor.service'; // ✅ EKLENDİ
import { Appointment } from '../../models/appointment.model';
import { Patient } from '../../models/patient.model';
import { MedicalRecordService } from '../../services/medical-record.service';
import { MedicalRecord } from '../../models/medical-record.model';
import { ActivatedRoute, Router } from '@angular/router'; // en üst importlara EKLE

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss']
})
export class DoctorDashboardComponent implements OnInit {

  activeTab: 'appointments' | 'patients' | 'medicalRecords' | 'prescriptions' = 'appointments';
  showAppointmentForm = false;
  showRecordForm = false;
  showRecordView = false;
  showPrescriptionForm: boolean = false;

  user: any;
  doctorId?: number;

  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  selectedAppointment?: Appointment;

  searchText: string = '';
  statusFilter: string = '';
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  patients: Patient[] = [];
  medicalRecords: MedicalRecord[] = [];
  selectedRecord?: MedicalRecord;

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService, // ✅ EKLENDİ
    private authService: AuthService,
    private medicalRecordService: MedicalRecordService,
    private route: ActivatedRoute, // 🔹 EKLE
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;

    // 🔹 Eğer query parametre olarak tab=prescriptions geldiyse o sekmeyi aktif et
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });

    if (this.user) {
      this.doctorService.getDoctorByUserId(this.user.id).subscribe({
        next: doctor => {
          this.doctorId = doctor.id;
          this.loadAppointments();
          this.loadPatients();
          this.loadMedicalRecords();
        },
        error: err => console.error('Doktor bilgisi alınamadı', err)
      });
    }
  }

  // Sekme değişimi
  setTab(tab: 'appointments' | 'patients' | 'medicalRecords' | 'prescriptions') {
    this.activeTab = tab;
    this.showAppointmentForm = false;
    this.showRecordForm = false;

    // 🔹 URL'de tab parametresini güncelle
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge', // mevcut diğer parametreleri korur
    });
  }
  

  // Randevular
  loadAppointments() {
    if (!this.doctorId) return;
    this.appointmentService.getAppointmentsByDoctorId(this.doctorId).subscribe({
      next: res => {
        this.appointments = res;
        this.filteredAppointments = [...this.appointments];
      },
      error: err => console.error('Randevular yüklenemedi', err)
    });
  }

  openAppointmentForm(app?: Appointment) {
    this.selectedAppointment = app ? { ...app } : undefined;
    this.showAppointmentForm = true;
  }

  closeAppointmentForm() {
    this.selectedAppointment = undefined;
    this.showAppointmentForm = false;
  }

  onAppointmentSubmitted() {
    this.loadAppointments();
    this.closeAppointmentForm();
  }

  deleteAppointment(id?: number) {
    if (!id) return;
    if (!confirm('Bu randevuyu silmek istediğinize emin misiniz?')) return;

    this.appointmentService.deleteAppointment(id).subscribe({
      next: () => this.loadAppointments(),
      error: err => console.error('Randevu silinemedi', err)
    });
  }

  applyFilters() {
    this.filteredAppointments = this.appointments.filter(app => {
      const matchesName = `${app.patient.firstName} ${app.patient.lastName}`
        .toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStatus = this.statusFilter ? app.status === this.statusFilter : true;

      // Tarih filtresi eklemek istersen burada kontrol ekleyebilirsin

      return matchesName && matchesStatus;
    });
  }

  sortAppointments(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.filteredAppointments.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch(field) {
        case 'patient':
          aValue = a.patient.firstName + ' ' + a.patient.lastName;
          bValue = b.patient.firstName + ' ' + b.patient.lastName;
          break;
        case 'date':
          aValue = new Date(a.appointmentDate).getTime();
          bValue = new Date(b.appointmentDate).getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default: return 0;
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }


  updateAppointmentStatus(appointment: Appointment) {
    if (!appointment.id) return;

    const updatedAppointment = {
      patientId: appointment.patient.id,
      doctorId: this.doctorId,
      appointmentDate: appointment.appointmentDate,
      status: appointment.status
    };

    this.appointmentService.updateAppointment(appointment.id, updatedAppointment).subscribe({
      next: () => {
        console.log(`Randevu ${appointment.id} durumu güncellendi: ${appointment.status}`);
        // listeyi tekrar yüklemek istersen uncomment:
        // this.loadAppointments();
      },
      error: err => {
        console.error('Randevu durumu güncellenemedi', err);
        alert('Durum güncelleme başarısız!');
      }
    });
  }

  // Hastalar
  loadPatients() {
    this.patientService.getAllPatients().subscribe({
    next: res => this.patients = res,
    error: err => console.error('Hastalar yüklenemedi', err)
    });
  }

  loadMedicalRecords() {
    if (!this.doctorId) return;
    console.log('Fetching medical records for doctorId:', this.doctorId); // 🟢 ekle
    this.medicalRecordService.getByDoctor(this.doctorId).subscribe({
      next: (res) => {
        console.log('MedicalRecords response:', res); // 🟢 ekle
        this.medicalRecords = res;
      },
      error: (err) => console.error('Medical Records yüklenemedi', err)
    });
  }

  onRecordSaved() {
    this.loadMedicalRecords();
    this.closeRecordForm();
  }

  openRecordForm(record?: MedicalRecord) {
    this.selectedRecord = record ? { ...record } : undefined;
    this.showRecordForm = true;
    this.showRecordView = false;
  }

  viewRecord(record: MedicalRecord) {
    this.selectedRecord = { ...record };
    this.showRecordView = true;
    this.showRecordForm = false;
  }

  closeRecordForm() {
    this.selectedRecord = undefined;
    this.showRecordForm = false;
  }

  closeRecordView() {
    this.selectedRecord = undefined;
    this.showRecordView = false;
  }

}
