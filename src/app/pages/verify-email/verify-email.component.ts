import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
})

export class VerifyEmailComponent implements OnInit {
  verifying = true;
  success = false;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public router: Router // HTML'de router.navigate kullanıyorsun, bu yüzden 'public' olmalı
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.verifying = false;
      this.success = false;
      this.message = 'Geçersiz veya eksik token.';
      return;
    }

    this.http.post(`${environment.apiUrl}/auth/verify-email`, { token }).subscribe({
      next: (res: any) => {
        this.verifying = false;
        this.success = true;
        this.message = res.message || 'E-posta başarıyla doğrulandı!';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.verifying = false;
        this.success = false;
        this.message = err.error?.message || 'Doğrulama başarısız.';
      }
    });
  }
}

