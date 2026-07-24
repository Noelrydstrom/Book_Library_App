import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {

    const user = {
      username: this.username,
      password: this.password
    };

    this.authService.register(user).subscribe({

      next: () => {

        alert("User created successfully!");

        this.router.navigate(['/login']);

      },

      error: (err) => {

        if (err.status === 400) {
          alert("Username already exists.");
        } else {
          alert("Could not register user.");
        }

      }

    });

  }

}