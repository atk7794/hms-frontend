import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
})
export class PatientFormComponent implements OnInit, OnChanges {
  @Input() patient?: Patient;
  @Output() formSubmitted = new EventEmitter<void>();

  patientForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private patientService: PatientService
  ) {}

//  ngOnInit(): void {
//    this.patientForm = this.fb.group({
//      firstName: [this.patient?.firstName || '', Validators.required],
//      lastName: [this.patient?.lastName || '', Validators.required],
//      birthDate: [this.patient?.birthDate || '', Validators.required],
//      gender: [this.patient?.gender || '', Validators.required],
//      email: ['', [Validators.required, Validators.email]],
//      password: ['', Validators.required],
//    });
//  }


  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patient'] && this.patientForm) {
      this.patientForm.patchValue({
        firstName: this.patient?.firstName || '',
        lastName: this.patient?.lastName || '',
        birthDate: this.patient?.birthDate || '',
        gender: this.patient?.gender || ''
      });
    }
  }

  initForm() {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      email: [''],
      password: ['']
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.patientForm.invalid) return;

    const formData = this.patientForm.value;

    if (this.patient) {
      // Güncelle
      this.patientService.updatePatient(this.patient.id!, formData).subscribe({
        next: () => {
          alert('Hasta güncellendi!');
          this.formSubmitted.emit();
        },
        error: () => alert('Güncelleme başarısız oldu.')
      });
    } else {
      // Yeni hasta + user kaydı
      const registerData = {
        email: formData.email,
        password: formData.password,
        role: 'PATIENT',
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        gender: formData.gender
      };

      this.authService.register(registerData).subscribe({
        next: () => {
          alert('Hasta başarıyla eklendi ve kullanıcı oluşturuldu!');
          this.formSubmitted.emit();
        },
        error: (err) => alert('Hasta ekleme başarısız: ' + err.message)
      });
    }
  }
}
