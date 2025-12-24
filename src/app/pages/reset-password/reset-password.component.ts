import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  token: string | null = null;
  message: string | null = null;
  error: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.error = 'Geçersiz bağlantı!';
    }
  }

  onSubmit(): void {
    if (this.form.invalid || !this.token) return;

    const { newPassword, confirmPassword } = this.form.value;

    if (newPassword !== confirmPassword) {
      this.error = 'Şifreler eşleşmiyor!';
      return;
    }

    this.loading = true;
    this.error = null;
    this.message = null;

    this.http.post(`${environment.apiUrl}/auth/reset-password`, {
        token: this.token,
        newPassword
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.message = res.message;  // artık JSON içindeki message okunacak
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Şifre sıfırlama başarısız.';
      }
    });

  }
}
