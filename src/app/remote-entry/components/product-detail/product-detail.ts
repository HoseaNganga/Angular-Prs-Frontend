import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product/product-service';
import { VendorService } from '../../../services/vendor/vendor';
import { Subject, takeUntil } from 'rxjs';
import { VendorInterface } from '../vendor/model/vendor.model';
import { ProductInterface } from '../products/models/product.model';

@Component({
  selector: 'app-product-detail',
  imports: [
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,

    MatSelectModule,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly vendorService = inject(VendorService);
  private readonly activatedRoute = inject(ActivatedRoute);
  productForm!: FormGroup;
  private readonly destroy$ = new Subject<void>();
  vendorList!: VendorInterface[];
  productId!: number;

  ngOnInit(): void {
    this.productForm = this.fb.group({
      partNbr: ['', Validators.required],
      name: ['', Validators.required],
      price: [0, Validators.required],
      unit: ['Each'],
      photoPath: ['', Validators.required],
      vendor: [null, Validators.required],
    });

    this.productId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.loadAllVendors();
  }

  loadAllVendors() {
    this.vendorService
      .getAllVendors()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.vendorList = res;
          this.loadProductDetails();
        },
        error: (err) => {
          alert(err.message || 'Unable To Fetch Vendor List');
        },
      });
  }

  loadProductDetails() {
    this.productService
      .getProductById(this.productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.productForm.patchValue({
            partNbr: res.partNbr,
            name: res.name,
            price: res.price,
            unit: res.unit,
            photoPath: res.photoPath,
            vendor: res.vendor?.id,
          });
        },
        error: (err) => {
          alert(err.message || 'Unable To Fetch Product Details');
        },
      });
  }

  handleEditDetails() {
    if (this.productForm.invalid) return;

    const formValue = this.productForm.value;

    const selectedVendor = this.vendorList.find(
      (v) => v.id === formValue.vendor
    );

    if (!selectedVendor) {
      alert('Invalid vendor selected');
      return;
    }

    const updatedProduct: ProductInterface = {
      ...formValue,
      id: this.productId,
      vendor: selectedVendor,
    };

    this.productService
      .editProductById(this.productId, updatedProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/products']);
          this.productForm.reset();
        },
        error: (err) => {
          alert(err.message || 'Failed To Update Product!');
        },
      });
  }

  handleDeleteProduct() {
    this.productService
      .deleteProduct(this.productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.router.navigate(['/products']);
        },
        error: (err) => {
          alert(err.message || 'Failed To Delete Product');
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
