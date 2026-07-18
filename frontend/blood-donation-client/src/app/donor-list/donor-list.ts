import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Donor } from '../services/donor';

@Component({
  selector: 'app-donor-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './donor-list.html',
  styleUrl: './donor-list.css'
})
export class DonorList implements OnInit {

  donors: any[] = [];

  constructor(
    private donorService: Donor,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDonors();
  }

  loadDonors() {

  this.donorService.getDonors().subscribe({

    next: (response: any) => {

      console.log("Response =", response);
      console.log("Is Array =", Array.isArray(response));
      console.log("Length =", response.length);

      this.donors = response;

      console.log("Donors =", this.donors);

    },

    error: (error) => {

      console.log("Error =", error);

      alert("Unable to load donors.");

    }

  });

}

  addDonor() {
    this.router.navigate(['/donor-add']);
  }

  deleteDonor(id: number) {

    if (confirm("Are you sure you want to delete this donor?")) {

      this.donorService.deleteDonor(id).subscribe({

        next: (response: any) => {

          alert(response.message);

          this.loadDonors();

        },

        error: (error) => {

          console.log(error);
          alert("Unable to delete donor.");

        }

      });

    }

  }

}