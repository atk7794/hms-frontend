import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  form: FormGroup;
  message: string | null = null;
  error: string | null = null;
  loading = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.message = null;
    this.error = null;

    const email = this.form.value.email;

    this.http.post<{ message: string }>(`${environment.apiUrl}/auth/forgot-password`, { email })
      .subscribe({
        next: (res) => {
          this.loading = false;
          // Backend artık JSON dönüyor, direkt message'i göster
          this.message = res.message;
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.';
        }
      });
  }
}
