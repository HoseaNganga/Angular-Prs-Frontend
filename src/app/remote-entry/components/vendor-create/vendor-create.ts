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
import { VendorService } from '../../../services/vendor/vendor';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { VendorInterface } from '../vendor/model/vendor.model';

@Component({
  selector: 'app-vendor-create',
  imports: [
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './vendor-create.html',
  styleUrl: './vendor-create.scss',
})
export class VendorCreate implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly vendorService = inject(VendorService);
  vendorForm!: FormGroup;
  private readonly destroy$ = new Subject<void>();

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
      password: ['', Validators.required],
      preferred: [true],
    });
  }

  handleSubmit() {
    if (this.vendorForm.invalid) return;

    const newVendor: VendorInterface = this.vendorForm.value;
    this.vendorService
      .createVendor(newVendor)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.router.navigate([`/vendors`]);
        },
        error: (err) => {
          alert(err.message || 'Error creating A Vendor!');
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
