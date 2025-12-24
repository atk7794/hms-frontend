import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) return;

    const userData = {
      ...this.registerForm.value,
      birthDate: new Date(this.registerForm.value.birthDate).toISOString().split('T')[0],
      role: 'PATIENT'
    };

    this.authService.register(userData).subscribe({
      next: (res:any) => {
        // Kayıt başarılı, kullanıcıya e-posta doğrulama gönderildiğini belirt
        alert('Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın. Gönderilen link ile hesabınızı aktif hale getirebilirsiniz.');
        this.router.navigate(['/login']); // istersen burayı /verify-email info sayfasına yönlendirebilirsin
      },
      error: (err:any) => {
        alert(err.error?.message || 'Kayıt sırasında bir hata oluştu.');
      }
    });
    
  }
}
