import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Donor } from '../services/donor';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  fullName = '';
  totalDonors = 0;

  constructor(
    private donorService: Donor,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.fullName = localStorage.getItem('fullName') || '';

    this.loadDashboard();

  }

  loadDashboard() {

    this.donorService.getDonors().subscribe({

      next: (response: any) => {

        console.log(response);

        this.totalDonors = response.length;

      },

      error: (error) => {

        console.log(error);

      }

    });

  }

  logout() {

    localStorage.clear();

    this.router.navigate(['/login']);

  }

}