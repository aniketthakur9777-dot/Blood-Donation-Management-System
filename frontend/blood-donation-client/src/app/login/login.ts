import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email: string = '';
  password: string = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) { }

  login() {

    const user = {
      email: this.email,
      password: this.password
    };

    this.auth.login(user).subscribe({

      next: (response: any) => {

        // Save Login Data
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId.toString());
        localStorage.setItem('fullName', response.fullName);
        localStorage.setItem('roleId', response.roleId.toString());

        console.log(response);

        alert(response.message);

        this.router.navigate(['/dashboard']);

      },

      error: (error) => {

        console.log(error);

        if (error.error?.message) {
          alert(error.error.message);
        }
        else {
          alert("Invalid Email or Password");
        }

      }

    });

  }

}