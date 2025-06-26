import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product/product-service';
import { RequestService } from '../../../services/request/request-service';
import { Subject, takeUntil } from 'rxjs';
import { ProductInterface } from '../products/models/product.model';
import { RequestInterface } from '../requests/models/request.model';
import { RequestLineUpload } from './model/requestline.model';

@Component({
  selector: 'app-requestline-create',
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
  templateUrl: './requestline-create.html',
  styleUrl: './requestline-create.scss',
})
export class RequestlineCreate implements OnInit {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly requestService = inject(RequestService);
  private readonly activatedRoute = inject(ActivatedRoute);
  requestLineForm!: FormGroup;
  private readonly destroy$ = new Subject<void>();
  productList!: ProductInterface[];
  requestId!: number;
  requestData!: RequestInterface;

  ngOnInit(): void {
    this.requestLineForm = this.fb.group({
      quantity: [0, Validators.required],
      product: ['', Validators.required],
    });
    this.requestId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.loadProductDetails();
  }

  loadProductDetails() {
    this.productService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ProductInterface[]) => {
          this.productList = res;
        },
        error: (err) => {
          alert(err.message || 'Unable To Fetch Product Details');
        },
      });
  }

  routeRequestList() {
    this.router.navigate([`/request/request-line/${this.requestId}`]);
  }

  handleSubmit() {
    if (this.requestLineForm.invalid) return;

    const newRequestLine: RequestLineUpload = {
      ...this.requestLineForm.value,
      request: {
        id: this.requestId,
      },
      product: {
        id: this.requestLineForm.value.product,
      },
    };

    this.requestService
      .createNewLineRequest(newRequestLine)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.router.navigate([`/request/request-line/${this.requestId}`]);
          this.requestLineForm.reset();
        },
        error: (err) => {
          alert(err.message || 'An error occured creating a Request Line!');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
