import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DoctorService } from '../../services/doctor.service';
import { PatientService } from '../../services/patient.service';
import { PrescriptionService } from '../../services/prescription.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prescription-form',
  templateUrl: './prescription-form.component.html',
  styleUrls: ['./prescription-form.component.scss']
})
export class PrescriptionFormComponent implements OnInit {
  @Input() patientId?: number;  // Admin veya Doctor dashboard'dan gelebilir
  @Input() doctorId!: number;

  @Input() record: any;     // <--- form açıldığında düzenlenecek reçete
  @Input() viewMode: boolean = false;  // <--- sadece görüntüleme modunda açmak istersek

  @Output() saved = new EventEmitter<void>();

  form!: FormGroup;
  role: string = '';
  doctors: any[] = [];
  patients: any[] = [];

  editMode: boolean = false;
  prescriptionId?: number;

  doctorName: string = '';

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private prescriptionService: PrescriptionService,
    private route: ActivatedRoute,  // <--
    private router: Router   // <-- bunu ekle
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUser;
    this.role = currentUser?.role || '';

    // Route parametresi varsa edit mod
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.editMode = true;
        this.prescriptionId = +idParam;
        this.loadPrescription(this.prescriptionId);
      }
    });

    // Form oluşturuluyor
    this.form = this.fb.group({
      prescriptionCode: [this.generatePrescriptionCode(), Validators.required],
      patientId: [this.patientId || '', Validators.required],
      doctorId: ['', Validators.required],
      medicalRecordId: [''],
      medication: ['', Validators.required],
      dosage: ['', Validators.required],
      instructions: ['', Validators.required]
    });

    // 🔹 Doktor ise
    if (this.role === 'DOCTOR') {
      const doctorId = currentUser?.id;

      // Doktor bilgilerini getir
      if (doctorId) {
        this.doctorService.getDoctorByUserId(doctorId).subscribe({
          next: doctor => {
            this.form.patchValue({ doctorId: doctor.id });
            this.doctorName = `${doctor.firstName} ${doctor.lastName}`;
            console.log('Doktor bilgisi yüklendi:', doctor);
          },
          error: err => console.error('Doktor bilgisi yüklenemedi', err)
        });
      }

      // Hasta listesini yükle
      this.patientService.getAllPatients().subscribe({
        next: patients => this.patients = patients,
        error: err => console.error('Hasta listesi yüklenemedi', err)
      });
    }

    // 🔹 Admin ise
    else if (this.role === 'ADMIN') {
      // Admin tüm doktor ve hastaları görebilir
      this.doctorService.getAllDoctors().subscribe({
        next: doctors => this.doctors = doctors,
        error: err => console.error('Doktor listesi yüklenemedi', err)
      });

      this.patientService.getAllPatients().subscribe({
        next: patients => this.patients = patients,
        error: err => console.error('Hasta listesi yüklenemedi', err)
      });
    }
  }

  private generatePrescriptionCode(): string {
    const now = new Date();
    return 'RX-' + now.getFullYear().toString().slice(2)
      + (now.getMonth() + 1).toString().padStart(2, '0')
      + now.getDate().toString().padStart(2, '0')
      + '-' + Math.floor(1000 + Math.random() * 9000);
  }

  submit(): void {
    console.log('🟢 Submit çağrıldı, editMode:', this.editMode);

    if (this.form.invalid) {
      console.warn('Form geçersiz:', this.form.value);
      return;
    }

    // 🔹 readonly alanlar da dahil olsun
    const formValue = this.form.getRawValue();  // <-- bunu kullan

    if (this.editMode && this.prescriptionId) {
      this.prescriptionService.update(this.prescriptionId, formValue).subscribe({  // <-- burada formValue
        next: res => {
          console.log('✅ Reçete güncellendi', res);
          alert('Reçete başarıyla güncellendi!');

          this.saved.emit(); // <--- emit

          // güncellemeden sonra listelemeye geç aktif olarak -->ADMIN DE EKLE ŞİMDİ SİLDİM.
          if (this.role === 'DOCTOR') {
            this.router.navigate(['/doctor/dashboard'], { queryParams: { tab: 'prescriptions' } });
          } else if (this.role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard'], { queryParams: { tab: 'prescriptions' } });
          }
        },
        error: err => console.error('❌ Reçete güncellenemedi', err)
      });
    } else {
      this.prescriptionService.create(formValue).subscribe({  // <-- burada formValue
        next: res => {
          console.log('✅ Reçete oluşturuldu', res);
          alert('Reçete başarıyla oluşturuldu!');

          this.saved.emit(); // <--- emit

          // Yeni oluşturma sonrası yönlendirme
          if (this.role === 'DOCTOR') {
            this.router.navigate(['/doctor/dashboard'], { queryParams: { tab: 'prescriptions' } });
          } else if (this.role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard'], { queryParams: { tab: 'prescriptions' } });
          }

          // 🔹 Önemli: showPrescriptionForm false olmalı
          if (this.role === 'DOCTOR') {
            const parentComponent = this as any; // Component içinden dışa müdahale için
            parentComponent.showPrescriptionForm = false; // bu şekilde form kapanacak
          }

          this.form.reset({
            prescriptionCode: this.generatePrescriptionCode(),
            doctorId: this.role === 'DOCTOR' ? this.authService.currentUser?.id : ''
          });
        },
        error: err => console.error('❌ Reçete oluşturulamadı', err)
      });
    }
  }

  private loadPrescription(id: number): void {
    this.prescriptionService.getById(id).subscribe({
      next: prescription => {
        this.form.patchValue({
          prescriptionCode: prescription.prescriptionCode,
          patientId: prescription.patientId,
          doctorId: prescription.doctorId,
          medicalRecordId: prescription.medicalRecordId || '',
          medication: prescription.medication,
          dosage: prescription.dosage,
          instructions: prescription.instructions
        });

        // Edit modda doctor/patient değişimi kısıtla
        if (this.editMode) {
          if (this.role === 'DOCTOR') this.form.get('doctorId')?.disable();
          if (this.role === 'PATIENT') this.form.get('patientId')?.disable();
        }
      },
      error: err => console.error('Reçete yüklenemedi', err)
    });
  }
}
