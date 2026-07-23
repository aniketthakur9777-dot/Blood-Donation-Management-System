import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { Donor } from '../services/donor';
import { InventoryService } from '../services/inventory';
import { BloodRequestService } from '../services/blood-request';
import { DonationHistoryService } from '../services/donation-history';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  activeTab: 'overview' | 'donors' | 'inventory' | 'requests' | 'history' | 'users' | 'notifications' = 'overview';
  
  fullName = '';
  Math = Math;

  // Overview Stats
  totalDonors = 0;
  totalUnits = 0;
  pendingRequestsCount = 0;
  totalDonationsCount = 0;

  // Data lists
  donorsList: any[] = [];
  filteredDonors: any[] = [];
  inventoryList: any[] = [];
  requestsList: any[] = [];
  historyList: any[] = [];
  usersList: any[] = [];

  // Search & Filters
  donorSearch = '';
  selectedBloodGroup = '';

  // Modals & Form States
  showAddDonorModal = false;
  showEditDonorModal = false;
  editingDonor: any = null;

  newDonor = {
    fullName: '',
    bloodGroup: 'O+',
    phoneNumber: '',
    email: '',
    city: '',
    isEligible: true,
    lastDonationDate: ''
  };

  showStockModal = false;
  selectedStockGroup = 'O+';
  newStockUnits = 0;

  showLogDonationModal = false;
  donationLog = {
    donorId: 0,
    donationDate: new Date().toISOString().substring(0, 10),
    unitsDonated: 1,
    remarks: ''
  };

  showBroadcastModal = false;
  broadcastMessage = '';

  constructor(
    public auth: Auth,
    private router: Router,
    private donorService: Donor,
    private inventoryService: InventoryService,
    private requestService: BloodRequestService,
    private historyService: DonationHistoryService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const user = this.auth.currentUserSignal();
    this.fullName = user ? user.fullName : 'Administrator';
    this.loadAllData();
  }

  loadAllData() {
    this.loadDonors();
    this.loadInventory();
    this.loadRequests();
    this.loadHistory();
    this.loadUsers();
  }

  loadDonors() {
    this.donorService.getDonors().subscribe({
      next: (res: any[]) => {
        this.donorsList = res;
        this.applyDonorFilter();
        this.totalDonors = res.length;
      }
    });
  }

  applyDonorFilter() {
    this.filteredDonors = this.donorsList.filter(d => {
      const matchesSearch = !this.donorSearch || 
        d.fullName?.toLowerCase().includes(this.donorSearch.toLowerCase()) ||
        d.city?.toLowerCase().includes(this.donorSearch.toLowerCase()) ||
        d.email?.toLowerCase().includes(this.donorSearch.toLowerCase());
      const matchesGroup = !this.selectedBloodGroup || d.bloodGroup === this.selectedBloodGroup;
      return matchesSearch && matchesGroup;
    });
  }

  loadInventory() {
    this.inventoryService.getInventory().subscribe({
      next: (res: any[]) => {
        this.inventoryList = res;
        this.totalUnits = res.reduce((acc: number, curr: any) => acc + (curr.unitsAvailable || 0), 0);
      }
    });
  }

  loadRequests() {
    this.requestService.getBloodRequests().subscribe({
      next: (res: any[]) => {
        this.requestsList = res;
        this.pendingRequestsCount = res.filter((r: any) => r.status === 'Pending').length;
      }
    });
  }

  loadHistory() {
    this.historyService.getHistory().subscribe({
      next: (res: any[]) => {
        this.historyList = res;
        this.totalDonationsCount = res.length;
      }
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (res: any[]) => {
        this.usersList = res;
      }
    });
  }

  // Donor CRUD
  openAddDonor() {
    this.newDonor = {
      fullName: '',
      bloodGroup: 'O+',
      phoneNumber: '',
      email: '',
      city: '',
      isEligible: true,
      lastDonationDate: ''
    };
    this.showAddDonorModal = true;
  }

  saveAddDonor() {
    if (!this.newDonor.fullName || !this.newDonor.phoneNumber) return;
    this.donorService.addDonor(this.newDonor).subscribe({
      next: () => {
        this.showAddDonorModal = false;
        this.loadDonors();
      }
    });
  }

  openEditDonor(donor: any) {
    this.editingDonor = { ...donor };
    this.showEditDonorModal = true;
  }

  saveEditDonor() {
    if (!this.editingDonor) return;
    this.donorService.updateDonor(this.editingDonor.donorId, this.editingDonor).subscribe({
      next: () => {
        this.showEditDonorModal = false;
        this.loadDonors();
      }
    });
  }

  deleteDonor(id: number) {
    if (confirm('Are you sure you want to delete this donor record?')) {
      this.donorService.deleteDonor(id).subscribe({
        next: () => this.loadDonors()
      });
    }
  }

  // Inventory Management
  openRestockModal(group?: string) {
    if (group) this.selectedStockGroup = group;
    const current = this.inventoryList.find(i => i.bloodGroup === this.selectedStockGroup);
    this.newStockUnits = current ? current.unitsAvailable : 0;
    this.showStockModal = true;
  }

  saveStockUpdate() {
    this.inventoryService.updateUnits(this.selectedStockGroup, Number(this.newStockUnits)).subscribe({
      next: () => {
        this.showStockModal = false;
        this.loadInventory();
      }
    });
  }

  // Request Management
  updateRequestStatus(id: number, status: string) {
    this.requestService.updateStatus(id, status).subscribe({
      next: () => {
        this.loadRequests();
        this.loadInventory();
      }
    });
  }

  // Donation Logging
  openLogDonationModal() {
    this.donationLog = {
      donorId: this.donorsList[0]?.donorId || 0,
      donationDate: new Date().toISOString().substring(0, 10),
      unitsDonated: 1,
      remarks: 'Routine Donation'
    };
    this.showLogDonationModal = true;
  }

  saveDonationLog() {
    if (!this.donationLog.donorId) return;
    this.historyService.addDonation({
      donorId: Number(this.donationLog.donorId),
      donationDate: this.donationLog.donationDate,
      unitsDonated: Number(this.donationLog.unitsDonated),
      remarks: this.donationLog.remarks
    }).subscribe({
      next: () => {
        this.showLogDonationModal = false;
        this.loadHistory();
        this.loadInventory();
        this.loadDonors();
      }
    });
  }

  // User Status Toggle
  toggleUserStatus(userId: number) {
    this.userService.toggleUserStatus(userId).subscribe({
      next: () => this.loadUsers()
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
