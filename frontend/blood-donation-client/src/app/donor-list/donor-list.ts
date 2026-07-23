import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Donor } from '../services/donor';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-donor-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './donor-list.html',
  styleUrl: './donor-list.css'
})
export class DonorList implements OnInit {
  donors: any[] = [];
  filteredDonors: any[] = [];

  searchTerm: string = '';
  selectedBloodGroup: string = 'ALL';
  selectedEligibility: string = 'ALL';

  isLoading = true;
  editingDonor: any = null;

  constructor(
    public auth: Auth,
    private donorService: Donor,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadDonors();
  }

  loadDonors() {
    this.isLoading = true;
    this.donorService.getDonors().subscribe({
      next: (response: any) => {
        this.donors = response;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.log("Error loading donors", error);
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.filteredDonors = this.donors.filter(d => {
      const matchesSearch = !this.searchTerm ||
        (d.fullName && d.fullName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (d.email && d.email.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (d.phoneNumber && d.phoneNumber.includes(this.searchTerm));

      const matchesGroup = this.selectedBloodGroup === 'ALL' || d.bloodGroup === this.selectedBloodGroup;

      const matchesEligible = this.selectedEligibility === 'ALL' ||
        (this.selectedEligibility === 'YES' && d.isEligible) ||
        (this.selectedEligibility === 'NO' && !d.isEligible);

      return matchesSearch && matchesGroup && matchesEligible;
    });
  }

  openEditModal(donor: any) {
    this.editingDonor = { ...donor };
  }

  closeEditModal() {
    this.editingDonor = null;
  }

  saveDonorEdit() {
    if (!this.editingDonor) return;

    this.donorService.updateDonor(this.editingDonor.donorId, this.editingDonor).subscribe({
      next: () => {
        this.closeEditModal();
        this.loadDonors();
      },
      error: (err) => console.log('Error updating donor', err)
    });
  }

  deleteDonor(id: number) {
    if (confirm("Are you sure you want to remove this donor from the directory?")) {
      this.donorService.deleteDonor(id).subscribe({
        next: () => {
          this.loadDonors();
        },
        error: (error) => console.log(error)
      });
    }
  }

  addDonor() {
    this.router.navigate(['/donor-add']);
  }
}