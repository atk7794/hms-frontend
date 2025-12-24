import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
})
export class DoctorFormComponent implements OnInit, OnChanges {

  @Input() doctor?: Doctor;
  @Output() doctorUpdated = new EventEmitter<void>();

  doctorForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private doctorService: DoctorService
  ) {}

//  ngOnInit(): void {
//    this.doctorForm = this.fb.group({
//      firstName: [this.doctor?.firstName || '', Validators.required],
//      lastName: [this.doctor?.lastName || '', Validators.required],
//      specialty: [this.doctor?.specialty || '', Validators.required],
//      email: ['', [Validators.required, Validators.email]],
//      password: ['', Validators.required],
//    });
//  }


ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['doctor'] && this.doctorForm) {
      this.doctorForm.patchValue({
        firstName: this.doctor?.firstName || '',
        lastName: this.doctor?.lastName || '',
        specialty: this.doctor?.specialty || ''
      });
    }
  }

  initForm() {
    this.doctorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      specialty: ['', Validators.required],
      email: [''],
      password: ['']
    });
  }


  onSubmit(): void {
    this.submitted = true;
    if (this.doctorForm.invalid) return;

    const formData = this.doctorForm.value;

    if (this.doctor) {
      this.doctorService.updateDoctor(this.doctor.id!, formData).subscribe({
        next: () => {
          alert('Doktor güncellendi!');
          this.doctorUpdated.emit();
        },
        error: (err) => alert('Güncelleme hatası: ' + err)
      });
    } else {
      const registerData = {
        email: formData.email,
        password: formData.password,
        role: 'DOCTOR',
        firstName: formData.firstName,
        lastName: formData.lastName,
        specialty: formData.specialty
      };

      this.doctorService.createDoctor(formData).subscribe({
        next: () => {
          alert('Doktor başarıyla eklendi ve kullanıcı oluşturuldu!');
          this.doctorUpdated.emit();
        },
        error: (err) => alert('Doktor ekleme başarısız: ' + err.message)
      });

    }
  }
}
