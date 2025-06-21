import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ProductInterface } from '../../remote-entry/components/products/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);

  getAllProducts() {
    return this.http
      .get<ProductInterface[]>(`/api/products`)
      .pipe(catchError(this.handleError));
  }

  createNewProduct(data: ProductInterface) {
    return this.http
      .post<ProductInterface>(`/api/products`, data)
      .pipe(catchError(this.handleError));
  }

  getProductById(id: number) {
    return this.http
      .get<ProductInterface>(`/api/products/${id}`)
      .pipe(catchError(this.handleError));
  }

  editProductById(id: number, data: ProductInterface) {
    return this.http
      .put<ProductInterface>(`/api/products/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteProduct(id: number) {
    return this.http
      .delete(`/api/products/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => new Error('Something went wrong'));
  }
}
