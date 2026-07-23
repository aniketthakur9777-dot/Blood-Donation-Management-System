import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Donor } from '../services/donor';
import { InventoryService } from '../services/inventory';
import { BloodRequestService } from '../services/blood-request';
import { DonationHistoryService } from '../services/donation-history';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  fullName = '';
  totalDonors = 0;
  totalBloodUnits = 0;
  pendingRequestsCount = 0;
  totalDonationsCount = 0;

  inventoryList: any[] = [];
  recentRequests: any[] = [];
  recentDonations: any[] = [];

  isLoading = true;
  Math = Math;

  // Compatibility & Checker Modal States
  showMatrixModal = false;
  selectedMatrixGroup = 'O-';

  showCheckerModal = false;
  calcAge: number = 25;
  calcWeight: number = 65;
  calcDays: number = 95;
  eligibilityResult: { isEligible: boolean; reason: string } | null = null;

  // Compatibility mapping database
  compatibilityData: Record<string, { canGiveTo: string[]; canReceiveFrom: string[] }> = {
    'O-': { canGiveTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], canReceiveFrom: ['O-'] },
    'O+': { canGiveTo: ['O+', 'A+', 'B+', 'AB+'], canReceiveFrom: ['O-', 'O+'] },
    'A-': { canGiveTo: ['A-', 'A+', 'AB-', 'AB+'], canReceiveFrom: ['O-', 'A-'] },
    'A+': { canGiveTo: ['A+', 'AB+'], canReceiveFrom: ['O-', 'O+', 'A-', 'A+'] },
    'B-': { canGiveTo: ['B-', 'B+', 'AB-', 'AB+'], canReceiveFrom: ['O-', 'B-'] },
    'B+': { canGiveTo: ['B+', 'AB+'], canReceiveFrom: ['O-', 'O+', 'B-', 'B+'] },
    'AB-': { canGiveTo: ['AB-', 'AB+'], canReceiveFrom: ['O-', 'A-', 'B-', 'AB-'] },
    'AB+': { canGiveTo: ['AB+'], canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] }
  };

  constructor(
    public auth: Auth,
    private donorService: Donor,
    private inventoryService: InventoryService,
    private requestService: BloodRequestService,
    private historyService: DonationHistoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.fullName = localStorage.getItem('fullName') || 'User';
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;

    // Load Donors
    this.donorService.getDonors().subscribe({
      next: (res) => this.totalDonors = res.length,
      error: (err) => console.log(err)
    });

    // Load Blood Inventory
    this.inventoryService.getInventory().subscribe({
      next: (res) => {
        this.inventoryList = res;
        this.totalBloodUnits = res.reduce((acc, curr) => acc + (curr.unitsAvailable || 0), 0);
      },
      error: (err) => console.log(err)
    });

    // Load Blood Requests
    this.requestService.getRequests().subscribe({
      next: (res) => {
        this.recentRequests = res.slice(0, 5);
        this.pendingRequestsCount = res.filter(r => r.status === 'Pending').length;
      },
      error: (err) => console.log(err)
    });

    // Load Donation History
    this.historyService.getHistory().subscribe({
      next: (res) => {
        this.recentDonations = res.slice(0, 5);
        this.totalDonationsCount = res.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  getStockBadgeClass(units: number): string {
    if (units === 0) return 'badge-danger';
    if (units < 5) return 'badge-warning';
    return 'badge-success';
  }

  getStockStatusLabel(units: number): string {
    if (units === 0) return 'Out of Stock';
    if (units < 5) return 'Low Stock';
    return 'Healthy';
  }

  // Compatibility Modal Trigger
  openMatrixModal(group: string) {
    this.selectedMatrixGroup = group;
    this.showMatrixModal = true;
  }

  // Eligibility Checker
  openCheckerModal() {
    this.showCheckerModal = true;
    this.runChecker();
  }

  runChecker() {
    if (this.calcAge < 18 || this.calcAge > 65) {
      this.eligibilityResult = { isEligible: false, reason: 'Age must be between 18 and 65 years old.' };
      return;
    }
    if (this.calcWeight < 50) {
      this.eligibilityResult = { isEligible: false, reason: 'Weight must be at least 50 kg for donor safety.' };
      return;
    }
    if (this.calcDays < 90) {
      this.eligibilityResult = { isEligible: false, reason: `Minimum 90 days required between donations (${90 - this.calcDays} days remaining).` };
      return;
    }
    this.eligibilityResult = { isEligible: true, reason: 'Congratulations! You meet all health criteria for blood donation.' };
  }
}