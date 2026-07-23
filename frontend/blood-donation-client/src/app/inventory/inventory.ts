import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../services/inventory';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class InventoryComponent implements OnInit {
  inventoryList: any[] = [];
  isLoading = true;

  // Restock / Modal state
  selectedItem: any = null;
  unitsToAdd: number = 0;
  isSaving = false;

  constructor(
    public auth: Auth,
    private inventoryService: InventoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadInventory();
  }

  loadInventory() {
    this.isLoading = true;
    this.inventoryService.getInventory().subscribe({
      next: (res) => {
        this.inventoryList = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Error fetching inventory', err);
        this.isLoading = false;
      }
    });
  }

  openRestockModal(item: any) {
    this.selectedItem = { ...item };
    this.unitsToAdd = 0;
  }

  closeModal() {
    this.selectedItem = null;
  }

  saveStockUpdate() {
    if (!this.selectedItem) return;

    this.isSaving = true;
    const newTotal = Math.max(0, this.selectedItem.unitsAvailable + this.unitsToAdd);

    const payload = {
      bloodGroup: this.selectedItem.bloodGroup,
      unitsAvailable: newTotal
    };

    this.inventoryService.updateInventory(this.selectedItem.inventoryId, payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeModal();
        this.loadInventory();
      },
      error: (err) => {
        console.log('Error updating stock', err);
        this.isSaving = false;
      }
    });
  }

  getTotalUnits(): number {
    return this.inventoryList.reduce((acc, i) => acc + (i.unitsAvailable || 0), 0);
  }

  getCriticalCount(): number {
    return this.inventoryList.filter(i => (i.unitsAvailable || 0) < 5).length;
  }
}
