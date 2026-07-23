import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { Donor } from '../services/donor';
import { BloodRequestService } from '../services/blood-request';
import { DonationHistoryService } from '../services/donation-history';
import { NotificationService } from '../services/notification';

@Component({
  selector: 'app-donor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './donor-dashboard.html',
  styleUrl: './donor-dashboard.css'
})
export class DonorDashboard implements OnInit {
  fullName = '';
  email = '';
  phone = '';
  userId = 0;

  // Donor Record Info
  donorProfile: any = null;
  bloodGroup = 'O+';
  isEligible = true;
  lastDonationDate = 'None';
  nextEligibleDate = 'Eligible Now';

  // Lists
  myRequests: any[] = [];
  myHistory: any[] = [];
  myNotifications: any[] = [];

  // Modals & Form
  showEditProfileModal = false;
  profileForm = {
    fullName: '',
    phoneNumber: '',
    email: '',
    city: ''
  };

  showRequestModal = false;
  newRequest = {
    patientName: '',
    bloodGroup: 'O+',
    unitsRequired: 1,
    hospitalName: '',
    contactNumber: ''
  };

  activeTab: 'profile' | 'requests' | 'history' | 'notifications' = 'profile';

  constructor(
    public auth: Auth,
    private router: Router,
    private donorService: Donor,
    private requestService: BloodRequestService,
    private historyService: DonationHistoryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const user = this.auth.currentUserSignal();
    if (user) {
      this.fullName = user.fullName;
      this.userId = user.userId;
    }
    this.loadDonorProfile();
    this.loadMyData();
  }

  loadDonorProfile() {
    this.donorService.getDonors().subscribe({
      next: (donors: any[]) => {
        // Find donor matching user's email or name if present
        const match = donors.find((d: any) => 
          (d.email && d.email.toLowerCase() === this.email.toLowerCase()) ||
          (d.fullName && d.fullName.toLowerCase() === this.fullName.toLowerCase())
        );
        if (match) {
          this.donorProfile = match;
          this.bloodGroup = match.bloodGroup || 'O+';
          this.isEligible = match.isEligible ?? true;
          this.lastDonationDate = match.lastDonationDate || 'No previous recorded donation';
          
          if (match.lastDonationDate) {
            const lastDate = new Date(match.lastDonationDate);
            const nextDate = new Date(lastDate);
            nextDate.setDate(nextDate.getDate() + 90); // 90 days interval
            const today = new Date();
            if (nextDate > today) {
              this.nextEligibleDate = nextDate.toISOString().substring(0, 10);
            } else {
              this.nextEligibleDate = 'Eligible Now';
            }
          }
        }
      }
    });
  }

  loadMyData() {
    // Requests
    this.requestService.getBloodRequests().subscribe({
      next: (res: any[]) => {
        // Filter requests submitted by this patient/user name
        this.myRequests = res.filter((r: any) => 
          r.patientName?.toLowerCase().includes(this.fullName.toLowerCase()) || true // show all for demo
        );
      }
    });

    // History
    this.historyService.getHistory().subscribe({
      next: (res: any[]) => {
        if (this.donorProfile) {
          this.myHistory = res.filter((h: any) => h.donorId === this.donorProfile.donorId);
        } else {
          this.myHistory = res.slice(0, 3);
        }
      }
    });

    // Notifications
    this.notificationService.getNotifications(this.userId).subscribe({
      next: (res: any[]) => {
        this.myNotifications = res;
      }
    });
  }

  openEditProfile() {
    this.profileForm = {
      fullName: this.fullName,
      phoneNumber: this.donorProfile?.phoneNumber || '',
      email: this.email,
      city: this.donorProfile?.city || ''
    };
    this.showEditProfileModal = true;
  }

  saveProfile() {
    this.fullName = this.profileForm.fullName;
    if (this.donorProfile) {
      const updated = {
        ...this.donorProfile,
        fullName: this.profileForm.fullName,
        phoneNumber: this.profileForm.phoneNumber,
        city: this.profileForm.city
      };
      this.donorService.updateDonor(this.donorProfile.donorId, updated).subscribe({
        next: () => {
          this.showEditProfileModal = false;
          this.loadDonorProfile();
        }
      });
    } else {
      this.showEditProfileModal = false;
    }
  }

  openCreateRequest() {
    this.newRequest = {
      patientName: this.fullName,
      bloodGroup: this.bloodGroup,
      unitsRequired: 1,
      hospitalName: '',
      contactNumber: this.donorProfile?.phoneNumber || ''
    };
    this.showRequestModal = true;
  }

  submitRequest() {
    if (!this.newRequest.patientName || !this.newRequest.hospitalName) return;
    this.requestService.createRequest(this.newRequest).subscribe({
      next: () => {
        this.showRequestModal = false;
        this.loadMyData();
        this.activeTab = 'requests';
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
