import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  displayedProductColumns,
  ProductInterface,
} from './models/product.model';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../services/product/product-service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-products',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly destroy$ = new Subject<void>();
  displayedColumns = displayedProductColumns;
  productList!: ProductInterface[];

  routeProductCreate() {
    this.router.navigate(['/product/create']);
  }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (val: ProductInterface[]) => {
          this.productList = val;
        },
      });
  }

  

  routeProductEdit(id: number) {
    this.router.navigate([`/product/details/${id}`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
