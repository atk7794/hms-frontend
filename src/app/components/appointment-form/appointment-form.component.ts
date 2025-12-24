import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from '../../services/auth.service';
import { Appointment } from '../../models/appointment.model';
import { Patient } from '../../models/patient.model';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent implements OnInit {

  @Input() appointment?: Appointment;
  @Input() doctorId?: number;
  @Output() formSubmitted = new EventEmitter<void>();
  @Output() cancelForm = new EventEmitter<void>();

  appointmentForm!: FormGroup;
  submitted = false;

  patients: Patient[] = [];
  doctors: Doctor[] = [];
  specialities: string[] = [];
  selectedSpeciality = '';

  currentUserRole!: string;
  currentUserId!: number;

  doctorFullName = '';
  doctorSpeciality = '';


  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser ?? JSON.parse(localStorage.getItem('user') || '{}');

    if (user && user.role) {
      this.currentUserRole = user.role;
      this.currentUserId = user.patientId ?? user.id;
    } else {
      console.warn('Kullanıcı bilgisi bulunamadı (login kontrol et)');
    }

    this.appointmentForm = this.fb.group({
      patientId: [this.currentUserRole === 'PATIENT' ? this.currentUserId : null, Validators.required],
      speciality: ['', Validators.required],
      doctorId: ['', Validators.required],
      appointmentDate: [this.appointment ? this.formatForInput(this.appointment.appointmentDate) : '', Validators.required],
      status: [this.appointment?.status || 'Scheduled', Validators.required]
    });

    // hastalar
    if (this.currentUserRole === 'ADMIN' || this.currentUserRole === 'DOCTOR') {
      this.patientService.getAllPatients().subscribe(data => this.patients = data);
    }

    // Eğer doktor login olduysa bilgilerini doldur
    if (this.currentUserRole === 'DOCTOR' && this.doctorId) {
      this.doctorService.getDoctorById(this.doctorId).subscribe(doctor => {
        this.doctorFullName = `${doctor.firstName} ${doctor.lastName}`;
        this.doctorSpeciality = doctor.specialty;

        // Formu otomatik dolduralım
        this.appointmentForm.patchValue({
          doctorId: doctor.id,
          speciality: doctor.specialty
        });
      });
    }

    // Specialities yükle
    this.doctorService.getAllSpecialities().subscribe(data => {
      this.specialities = data;

      if (this.appointment) {
        this.selectedSpeciality = this.appointment.doctor.specialty;
      }
      this.loadDoctors();
    });
  }

  // ISO string → datetime-local için format
  formatForInput(date: string) {
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  loadDoctors() {
    if (this.selectedSpeciality) {
      this.doctorService.getDoctorsBySpeciality(this.selectedSpeciality)
        .subscribe(data => {
          this.doctors = data;
          if (this.appointment && this.currentUserRole !== 'DOCTOR') {
            this.appointmentForm.patchValue({ doctorId: this.appointment.doctor.id });
          }
        });
    } else {
      this.doctorService.getAllDoctors().subscribe(data => {
        this.doctors = data;
        if (this.appointment && this.currentUserRole !== 'DOCTOR') {
          this.appointmentForm.patchValue({ doctorId: this.appointment.doctor.id });
        }
      });
    }
  }

  onSpecialityChange() {
    this.selectedSpeciality = this.appointmentForm.value.speciality;
    this.loadDoctors();
    this.appointmentForm.patchValue({ doctorId: '' });
  }

  onSubmit() {
    this.submitted = true;
    console.log('Form Value:', this.appointmentForm.value);
    console.log('Form Valid:', this.appointmentForm.valid);

    const controls = this.appointmentForm.controls;
    for (const name in controls) {
      console.log(`${name}:`, controls[name].value, 'valid:', controls[name].valid);
    }

    if (this.appointmentForm.invalid) {
      alert('Form eksik veya hatalı! Lütfen tüm alanları doldurun.');
      return;
    }

    const formValue = this.appointmentForm.value;

    const appointmentDateISO = formValue.appointmentDate
      ? formValue.appointmentDate + ':00'
      : '';

    const appointmentRequestDTO = {
      patientId: formValue.patientId,
      doctorId: this.currentUserRole === 'DOCTOR' ? this.doctorId : formValue.doctorId,
      appointmentDate: appointmentDateISO,
      status: formValue.status
    };

    const request$ = this.appointment
      ? this.appointmentService.updateAppointment(this.appointment.id!, appointmentRequestDTO)
      : this.appointmentService.createAppointment(appointmentRequestDTO);

    request$.subscribe({
      next: () => {
        alert(this.appointment ? 'Randevu güncellendi!' : 'Yeni randevu eklendi!');
        this.formSubmitted.emit();
      },
      error: (err) => {
        console.error('Randevu işlemi başarısız', err);
        alert('Randevu işlemi başarısız! Konsolu kontrol edin.');
      }
    });
  }

  onCancel() {
    this.cancelForm.emit();
  }

}
