import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

// login.component.ts
ngOnInit(): void {
  this.authService.logout(); // eski kullanıcıyı temizle
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
}

onSubmit() {
  this.submitted = true;
  this.error = null;

  if (this.loginForm.invalid) return;

  const { email, password } = this.loginForm.value;

  this.authService.login(email, password).subscribe({
    next: (res) => {
      console.log('Login response:', res);

      switch (res.role) {
        case 'PATIENT':
          this.router.navigate(['/patient/dashboard']);
          break;
        case 'DOCTOR':
          this.router.navigate(['/doctor/dashboard']);
          break;
        case 'ADMIN':
          this.router.navigate(['/admin/dashboard']);
          break;
        default:
          this.router.navigate(['/login']);
      }
    },

    // 🔹 BURASI EKLENEN KISIM 🔹
    error: (err) => {
      console.error('Login error:', err);
      if (err.error?.message?.includes('doğrulanmamış')) {
        this.error = 'Hesabınız doğrulanmamış. Lütfen e-postanızı kontrol edin.';
      } else {
        this.error = err.error?.message || 'E-posta veya şifre hatalı.';
      }
    }
  });
}

resendVerification() {
  const email = this.loginForm.get('email')?.value;
  if (!email) {
    alert('Lütfen önce e-posta adresinizi girin.');
    return;
  }

  this.authService.resendVerificationEmail(email).subscribe({
    next: (res: any) => {
      alert(res?.message || 'Doğrulama e-postası yeniden gönderildi. Lütfen e-postanızı kontrol edin.');
    },
    error: (err) => {
      console.error('Mail gönderme hatası:', err); // Hata logunu gör
      // Kullanıcıya yine başarılı mesaj göster
      alert('Doğrulama e-postası gönderildi. Lütfen e-postanızı kontrol edin.');
    }
  });
}

}
