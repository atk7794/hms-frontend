import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userEmail: string | null = null;
  userRole: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.userEmail = user?.email || null;
      this.userRole = user?.role || null;
    });
  }

  logout() {
    this.authService.logout();
  }

  goToDashboard() {
    if (!this.userRole) return;

    switch(this.userRole) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'DOCTOR':
        this.router.navigate(['/doctor/dashboard']);
        break;
      case 'PATIENT':
        this.router.navigate(['/patient/dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}
