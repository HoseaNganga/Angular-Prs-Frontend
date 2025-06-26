import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatOption } from '@angular/material/autocomplete';
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

import { RequestService } from '../../../services/request/request-service';
import { Subject, takeUntil } from 'rxjs';

import { RequestInterface } from '../requests/models/request.model';
import { LineItem } from '../request-line/model/request-line.model';
import { ProductService } from '../../../services/product/product-service';
import { ProductInterface } from '../products/models/product.model';

@Component({
  selector: 'app-request-detail',
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
  templateUrl: './request-detail.html',
  styleUrl: './request-detail.scss',
})
export class RequestDetail implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly requestService = inject(RequestService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  requestForm!: FormGroup;
  private readonly destroy$ = new Subject<void>();
  productList!: ProductInterface[];
  lineId!: number;
  requestData!: RequestInterface;
  lineData!: LineItem;

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      quantity: [0, Validators.required],
      product: [null, Validators.required],
    });

    this.lineId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.loadLineItemData();
  }

  loadLineItemData() {
    this.requestService
      .getLineItemById(this.lineId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.lineData = res;
          this.requestForm.patchValue({ quantity: res.quantity });
          this.loadAllProducts();
        },
        error: (err) => {
          alert(err.message || 'Unable To Fetch Line Item Details');
        },
      });
  }

  loadAllProducts() {
    this.productService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ProductInterface[]) => {
          this.productList = res;
          if (this.lineData) {
            const matchingProduct = this.productList.find(
              (p) => p.id === this.lineData.product.id
            );
            if (matchingProduct) {
              this.requestForm.patchValue({ product: matchingProduct });
            }
          }
        },
        error: (err) => {
          alert(err.message || 'Unable To Fetch Product Details');
        },
      });
  }

  routeRequestList() {
    this.router.navigate([`/request/request-line/${this.lineData.request.id}`]);
  }

  handleEdit() {
    if (this.requestForm.invalid) return;

    const updatedLineItem: LineItem = {
      id: this.lineData.id,
      quantity: this.requestForm.value.quantity,
      product: this.requestForm.value.product,
      request: this.lineData.request,
    };

    this.requestService
      .editLineItemById(updatedLineItem.id, updatedLineItem)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          alert('Line item updated!');
          this.router.navigate([
            `/request/request-line/${this.lineData.request.id}`,
          ]);
        },
        error: (err) => {
          alert(err.message || 'Failed to update line item.');
        },
      });
  }

  handleDelete() {
    this.requestService
      .deleteLineItemById(this.lineData.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          alert('Line item deleted successfully.');
          this.router.navigate([
            `/request/request-line/${this.lineData.request.id}`,
          ]);
        },
        error: (err) => {
          alert(err.message || 'Failed to delete line item.');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
