import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DonationHistoryService } from '../services/donation-history';
import { Donor } from '../services/donor';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-donation-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donation-history.html',
  styleUrl: './donation-history.css'
})
export class DonationHistoryComponent implements OnInit {
  historyList: any[] = [];
  filteredHistory: any[] = [];
  donorsList: any[] = [];
  searchTerm = '';
  isLoading = true;

  // New Donation Modal
  showModal = false;
  selectedDonorId: number = 0;
  donationDate: string = new Date().toISOString().split('T')[0];
  unitsDonated: number = 1;
  remarks: string = '';
  isSaving = false;

  constructor(
    public auth: Auth,
    private historyService: DonationHistoryService,
    private donorService: Donor,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadHistory();
    this.loadDonors();
  }

  loadHistory() {
    this.isLoading = true;
    this.historyService.getHistory().subscribe({
      next: (res) => {
        this.historyList = res;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Error fetching donation history', err);
        this.isLoading = false;
      }
    });
  }

  loadDonors() {
    this.donorService.getDonors().subscribe({
      next: (res) => {
        this.donorsList = res;
        if (res.length > 0) this.selectedDonorId = res[0].donorId;
      }
    });
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.filteredHistory = [...this.historyList];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredHistory = this.historyList.filter(h =>
        (h.donorName && h.donorName.toLowerCase().includes(term)) ||
        (h.bloodGroup && h.bloodGroup.toLowerCase().includes(term)) ||
        (h.remarks && h.remarks.toLowerCase().includes(term))
      );
    }
  }

  openRecordModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.remarks = '';
    this.unitsDonated = 1;
  }

  saveDonation() {
    if (!this.selectedDonorId || this.unitsDonated <= 0) {
      alert('Please select a donor and valid units donated.');
      return;
    }

    const payload = {
      donorId: Number(this.selectedDonorId),
      donationDate: this.donationDate,
      unitsDonated: this.unitsDonated,
      remarks: this.remarks
    };

    this.isSaving = true;
    this.historyService.recordDonation(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeModal();
        this.loadHistory();
      },
      error: (err) => {
        console.log(err);
        this.isSaving = false;
      }
    });
  }
}
