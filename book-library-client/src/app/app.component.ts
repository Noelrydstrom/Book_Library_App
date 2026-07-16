import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(
    public authService: AuthService,
    private router: Router
  ){

    const savedTheme = localStorage.getItem('darkMode');

    if(savedTheme === 'true'){

        this.darkMode = true;

        document.body.classList.add('dark-mode');

    }

  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  darkMode = false;

  toggleDarkMode() {

    this.darkMode = !this.darkMode;

    document.body.classList.toggle('dark-mode');

    localStorage.setItem('darkMode', this.darkMode.toString());

  }

}