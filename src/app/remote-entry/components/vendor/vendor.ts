import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { displayedVendorColumns, VendorInterface } from './model/vendor.model';
import { MatIconModule } from '@angular/material/icon';
import { VendorService } from '../../../services/vendor/vendor';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-vendor',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './vendor.html',
  styleUrl: './vendor.scss',
})
export class Vendor implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly vendorService = inject(VendorService);
  private readonly destroy$ = new Subject<void>();
  vendorList!: VendorInterface[];
  displayedColumns = displayedVendorColumns;

  routeVendorCreate() {
    this.router.navigate(['/vendor/create']);
  }

  ngOnInit(): void {
    this.loadAllVendors();
  }

  loadAllVendors() {
    this.vendorService
      .getAllVendors()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: VendorInterface[]) => {
          this.vendorList = res;
        },
      });
  }

  routeVendorEdit(id: number) {
    this.router.navigate([`/vendor/details/${id}`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
