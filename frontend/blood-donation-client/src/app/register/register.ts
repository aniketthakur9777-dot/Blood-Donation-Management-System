import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  currentStep = 1;
  totalSteps = 3;

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  phoneNumber = '';
  roleId = 2;

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private auth: Auth, private router: Router) {}

  nextStep() {
    if (this.currentStep === 1) {
      if (!this.fullName || !this.email) {
        this.errorMessage = 'Please fill in your name and email.';
        return;
      }
      if (!this.email.includes('@')) {
        this.errorMessage = 'Please enter a valid email address.';
        return;
      }
    }
    if (this.currentStep === 2) {
      if (!this.password || this.password.length < 6) {
        this.errorMessage = 'Password must be at least 6 characters.';
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }
    }
    this.errorMessage = '';
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep() {
    this.errorMessage = '';
    if (this.currentStep > 1) this.currentStep--;
  }

  getPasswordStrength(): string {
    if (!this.password) return 'none';
    if (this.password.length < 6) return 'weak';
    const hasUpper = /[A-Z]/.test(this.password);
    const hasNumber = /[0-9]/.test(this.password);
    const hasSpecial = /[^A-Za-z0-9]/.test(this.password);
    const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (this.password.length >= 10 && score >= 2) return 'strong';
    return 'medium';
  }

  register() {
    this.errorMessage = '';
    this.isLoading = true;
    const user = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      roleId: Number(this.roleId)
    };
    this.auth.register(user).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Account created successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}