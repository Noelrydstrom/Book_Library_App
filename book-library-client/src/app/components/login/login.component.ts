import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {

    if (!this.username || !this.password) {
      alert("Please fill in both fields.");
      return;
    }

    const user = {
      username: this.username,
      password: this.password
    };

    this.authService.login(user).subscribe({

      next: (response) => {

        this.authService.saveToken(response.token);

        alert("Login successful!");

        this.router.navigate(['/books']);
      },

      error: () => {
        alert("Wrong username or password.");
      }

    });

  }

}