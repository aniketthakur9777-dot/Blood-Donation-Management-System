import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  fullName = '';
  email = '';
  password = '';
  phoneNumber = '';

  constructor(private auth: Auth) { }

  register() {

    const user = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      roleId: 2
    };

    console.log(user);

    this.auth.register(user).subscribe({

      next: (response: any) => {

        console.log("Success Response:", response);

        if (response.message) {
          alert(response.message);
        } else {
          alert(JSON.stringify(response));
        }

      },

      error: (error) => {

        console.log("Error Response:", error);

        if (error.error) {
          alert(JSON.stringify(error.error));
        } else {
          alert("Something went wrong.");
        }

      }

    });

  }

}