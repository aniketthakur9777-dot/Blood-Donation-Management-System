import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Donor } from '../services/donor';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-donor-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './donor-add.html',
  styleUrl: './donor-add.css'
})
export class DonorAdd {
  bloodGroup: string = 'A+';
  gender: string = 'Male';
  dateOfBirth: string = '1998-05-15';
  weight: number = 70;
  address: string = '';
  lastDonationDate: string = '';
  isEligible: boolean = true;

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    public auth: Auth,
    private donorService: Donor,
    private router: Router
  ) { }

  addDonor() {
    if (!this.bloodGroup || !this.gender || !this.dateOfBirth || this.weight <= 0) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    const userId = Number(localStorage.getItem('userId')) || 1;

    const donor = {
      userId: userId,
      bloodGroup: this.bloodGroup,
      gender: this.gender,
      dateOfBirth: this.dateOfBirth,
      weight: this.weight,
      address: this.address,
      lastDonationDate: this.lastDonationDate || null,
      isEligible: this.isEligible
    };

    this.isLoading = true;
    this.errorMessage = '';

    this.donorService.addDonor(donor).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Donor enrolled successfully!';
        setTimeout(() => {
          this.router.navigate(['/donor-list']);
        }, 1200);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Unable to enroll donor.';
        }
      }
    });
  }
}