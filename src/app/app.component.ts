import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  showNavbar = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Navbar'ı gizleyeceğimiz sayfalar
        const hideNavbarOn = ['/login', '/register', '/home']; // , '/' eklenebilir..
        this.showNavbar = !hideNavbarOn.includes(event.urlAfterRedirects);
      }
    });
  }
}

// BRAYA TARAYICI KAPANDIĞINDA VEYA SAYFA DEĞİŞTİĞİNDE LOGOUT YAPILMASI EKLENECEK DİKKAT SAYFA DEĞİŞMESİ DERKEN ALAKASIZ OLMALI.. OK.
