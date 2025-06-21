import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product/product-service';
import { Subject, takeUntil } from 'rxjs';
import { ProductInterface } from '../products/models/product.model';
import { VendorInterface } from '../vendor/model/vendor.model';
import { VendorService } from '../../../services/vendor/vendor';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-product-create',
  imports: [
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatOption,
    MatSelectModule,
  ],
  templateUrl: './product-create.html',
  styleUrl: './product-create.scss',
})
export class ProductCreate implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly vendorService = inject(VendorService);
  productForm!: FormGroup;
  private readonly destroy$ = new Subject<void>();
  vendorList!: VendorInterface[];

  ngOnInit(): void {
    this.productForm = this.fb.group({
      partNbr: ['', Validators.required],
      name: ['', Validators.required],
      price: [0, Validators.required],
      unit: ['Each'],
      photoPath: ['', Validators.required],
      vendor: ['', Validators.required],
    });
    this.getAllVendors();
  }

  getAllVendors() {
    this.vendorService
      .getAllVendors()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: VendorInterface[]) => {
          this.vendorList = res;
        },
      });
  }

  handleSubmit() {
    if (this.productForm.invalid) return;

    const newProduct: ProductInterface = {
      ...this.productForm.value,
      vendor: {
        id: this.productForm.value.vendor,
      },
    };

    this.productService
      .createNewProduct(newProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.router.navigate(['/products']);
          this.productForm.reset();
        },
        error: (err) => {
          alert(err.message || 'An error occured creating a Product!');
        },
      });
  }

  routeProductList() {
    this.router.navigate(['/products']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
