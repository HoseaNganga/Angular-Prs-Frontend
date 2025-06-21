import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, takeUntil, throwError } from 'rxjs';
import { VendorInterface } from '../../remote-entry/components/vendor/model/vendor.model';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  private readonly http = inject(HttpClient);

  getAllVendors() {
    return this.http
      .get<VendorInterface[]>(`/api/vendors`)
      .pipe(catchError(this.handleError));
  }

  createVendor(data: VendorInterface) {
    return this.http
      .post<VendorInterface>(`/api/vendors`, data)
      .pipe(catchError(this.handleError));
  }

  getVendorById(id: number) {
    return this.http
      .get<VendorInterface>(`/api/vendors/${id}`)
      .pipe(catchError(this.handleError));
  }

  editVendorById(id: number, data: VendorInterface) {
    return this.http
      .put<VendorInterface>(`/api/vendors/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteVendorById(id: number) {
    return this.http
      .delete(`/api/vendors/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => new Error('Something went wrong'));
  }
}
