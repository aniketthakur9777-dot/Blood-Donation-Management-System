import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BloodRequestService } from '../services/blood-request';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-blood-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blood-requests.html',
  styleUrl: './blood-requests.css'
})
export class BloodRequestsComponent implements OnInit {
  requests: any[] = [];
  filteredRequests: any[] = [];
  statusFilter = 'ALL';
  isLoading = true;

  // New Request Form Modal
  showModal = false;
  patientName = '';
  bloodGroup = 'A+';
  unitsRequired = 1;
  hospitalName = '';
  contactNumber = '';
  isSaving = false;

  constructor(
    public auth: Auth,
    private requestService: BloodRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    this.requestService.getRequests().subscribe({
      next: (res) => {
        this.requests = res;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Error loading blood requests', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    if (this.statusFilter === 'ALL') {
      this.filteredRequests = [...this.requests];
    } else {
      this.filteredRequests = this.requests.filter(r => r.status === this.statusFilter);
    }
  }

  openCreateModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.patientName = '';
    this.hospitalName = '';
    this.contactNumber = '';
    this.unitsRequired = 1;
  }

  submitRequest() {
    if (!this.patientName || !this.hospitalName || this.unitsRequired <= 0) {
      alert('Please fill patient name, hospital name, and units required.');
      return;
    }

    const payload = {
      patientName: this.patientName,
      bloodGroup: this.bloodGroup,
      unitsRequired: this.unitsRequired,
      hospitalName: this.hospitalName,
      contactNumber: this.contactNumber
    };

    this.isSaving = true;
    this.requestService.createRequest(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeModal();
        this.loadRequests();
      },
      error: (err) => {
        console.log(err);
        this.isSaving = false;
      }
    });
  }

  changeStatus(id: number, newStatus: string) {
    this.requestService.updateStatus(id, newStatus).subscribe({
      next: () => {
        this.loadRequests();
      },
      error: (err) => console.log(err)
    });
  }

  deleteRequest(id: number) {
    if (confirm("Are you sure you want to cancel this request?")) {
      this.requestService.deleteRequest(id).subscribe({
        next: () => this.loadRequests(),
        error: (err) => console.log(err)
      });
    }
  }
}
