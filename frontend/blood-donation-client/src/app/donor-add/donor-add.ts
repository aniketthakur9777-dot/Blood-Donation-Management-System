import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Donor } from '../services/donor';

@Component({
  selector: 'app-donor-add',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './donor-add.html',
  styleUrl: './donor-add.css'
})
export class DonorAdd {

  bloodGroup: string = '';
  gender: string = '';
  dateOfBirth: string = '';
  weight: number = 0;
  address: string = '';
  lastDonationDate: string = '';
  isEligible: boolean = true;

  constructor(
    private donorService: Donor,
    private router: Router
  ) { }

  addDonor() {

    if (
      this.bloodGroup === '' ||
      this.gender === '' ||
      this.dateOfBirth === '' ||
      this.weight <= 0 ||
      this.address === ''
    ) {
      alert('Please fill all required fields.');
      return;
    }

    const donor = {

      userId: Number(localStorage.getItem('userId')),

      bloodGroup: this.bloodGroup,
      gender: this.gender,
      dateOfBirth: this.dateOfBirth,
      weight: this.weight,
      address: this.address,
      lastDonationDate: this.lastDonationDate || null,
      isEligible: this.isEligible

    };

    console.log(donor);

    this.donorService.addDonor(donor).subscribe({

      next: (response: any) => {

        alert(response.message);

        // Form Reset
        this.bloodGroup = '';
        this.gender = '';
        this.dateOfBirth = '';
        this.weight = 0;
        this.address = '';
        this.lastDonationDate = '';
        this.isEligible = true;

        // Dashboard (Home) par wapas
        this.router.navigate(['/dashboard']);

      },

      error: (error) => {

        console.log(error);

        if (error.error?.message) {
          alert(error.error.message);
        }
        else if (typeof error.error === 'string') {
          alert(error.error);
        }
        else {
          alert('Unable to add donor.');
        }

      }

    });

  }

}