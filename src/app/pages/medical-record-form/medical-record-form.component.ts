import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicalRecordService } from 'src/app/services/medical-record.service';
import { PatientService } from 'src/app/services/patient.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { MedicalRecord } from 'src/app/models/medical-record.model';

@Component({
  selector: 'app-medical-record-form',
  templateUrl: './medical-record-form.component.html',
  styleUrls: ['./medical-record-form.component.scss']
})
export class MedicalRecordFormComponent implements OnInit {

  @Input() record?: MedicalRecord;
  @Input() viewMode: boolean = false; // true ise sadece görüntüleme
  @Output() saved = new EventEmitter<void>();

  form!: FormGroup;
  patients: any[] = [];
  doctors: any[] = [];

  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private medicalRecordService: MedicalRecordService,
    private patientService: PatientService,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();

    this.form = this.fb.group({
      patientId: [{value: this.record?.patient?.id || '', disabled: this.viewMode}, Validators.required],
      doctorId: [{value: this.record?.doctor?.id || '', disabled: this.viewMode}, Validators.required],
      diagnosis: [{value: this.record?.diagnosis || '', disabled: this.viewMode}, Validators.required],
      prescription: [{value: this.record?.prescription || '', disabled: this.viewMode}, Validators.required],
      notes: [{value: this.record?.notes || '', disabled: this.viewMode}]
    });
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (data) => (this.patients = data),
      error: (err) => console.error('Hasta listesi alınamadı:', err)
    });
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => (this.doctors = data),
      error: (err) => console.error('Doktor listesi alınamadı:', err)
    });
  }

  onSubmit(): void {
    if (this.viewMode) return; // sadece görüntüleme ise işlem yok

    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      this.errorMessage = 'Lütfen tüm gerekli alanları doldurun.';
      return;
    }

    const payload = this.form.value;

    if (this.record) {
      // Güncelleme modu
      this.medicalRecordService.update(this.record.id, payload).subscribe({
        next: () => {
          this.successMessage = 'Kayıt başarıyla güncellendi!';
          this.saved.emit();
          this.autoHideMessages();
        },
        error: (err) => {
          this.errorMessage = 'Güncelleme başarısız: ' + err.message;
          this.autoHideMessages();
        }
      });
    } else {
      // Yeni kayıt
      this.medicalRecordService.create(payload).subscribe({
        next: () => {
          this.successMessage = 'Yeni tıbbi kayıt oluşturuldu!';
          this.saved.emit();
          this.form.reset();
          this.autoHideMessages();
        },
        error: (err) => {
          this.errorMessage = 'Kayıt eklenemedi: ' + err.message;
          this.autoHideMessages();
        }
      });
    }
  }

  autoHideMessages(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 4000);
  }
}
