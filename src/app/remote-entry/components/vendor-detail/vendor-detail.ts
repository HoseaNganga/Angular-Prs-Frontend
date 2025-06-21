import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { VendorService } from '../../../services/vendor/vendor';
import { VendorInterface } from '../vendor/model/vendor.model';

@Component({
  selector: 'app-vendor-detail',
  imports: [
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './vendor-detail.html',
  styleUrl: './vendor-detail.scss',
})
export class VendorDetail implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();
  private readonly fb = inject(FormBuilder);
  private readonly vendorService = inject(VendorService);
  vendorForm!: FormGroup;
  vendorId!: number;
  ngOnInit(): void {
    this.vendorForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', [Validators.required]],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      preferred: [true],
    });

    this.vendorId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.loadVendorDetails();
  }

  loadVendorDetails() {
    this.vendorService
      .getVendorById(this.vendorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.vendorForm.patchValue(res);
        },
      });
  }

  handleEditDetails() {
    if (this.vendorForm.invalid) {
      return;
    }

    const updatedVendor: VendorInterface = {
      ...this.vendorForm.value,
      id: this.vendorId,
    };

    this.vendorService
      .editVendorById(this.vendorId, updatedVendor)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.router.navigate([`/vendors`]);
        },
        error: (err) => {
          alert(err.message || 'Error Updating Vendor Details!');
        },
      });
  }

  handleDeleteVendor() {
    this.vendorService
      .deleteVendorById(this.vendorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.routeVendorList();
        },
        error: (err) => {
          alert(err.message || 'Error Deleting Vendor');
        },
      });
  }

  routeVendorList() {
    this.router.navigate(['/vendors']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
