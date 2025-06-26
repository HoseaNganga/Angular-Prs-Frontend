import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RequestInterface } from '../../remote-entry/components/requests/models/request.model';
import { catchError, Observable, throwError } from 'rxjs';
import { LineItem } from '../../remote-entry/components/request-line/model/request-line.model';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private readonly http = inject(HttpClient);

  getAllRequests() {
    return this.http
      .get<RequestInterface[]>(`/api/requests`)
      .pipe(catchError(this.handleError));
  }

  createNewRequest(data: RequestInterface) {
    return this.http
      .post<RequestInterface>(`/api/requests`, data)
      .pipe(catchError(this.handleError));
  }

  getRequestById(id: number) {
    return this.http
      .get<RequestInterface>(`/api/requests/${id}`)
      .pipe(catchError(this.handleError));
  }

  editRequestById(id: number, data: RequestInterface) {
    return this.http
      .put<RequestInterface>(`/api/requests/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  submitRequestForReview(id: number) {
    return this.http
      .put(`/api/requests/submit-review/${id}`, {})
      .pipe(catchError(this.handleError));
  }

  deleteRequestById(id: number) {
    return this.http
      .delete(`api/requests/${id}`)
      .pipe(catchError(this.handleError));
  }

  createNewLineRequest(data: any) {
    return this.http
      .post(`/api/requestLines`, data)
      .pipe(catchError(this.handleError));
  }

  getAllReviews(id: number | undefined) {
    return this.http
      .get<RequestInterface[]>(`/api/requests/review-queue?reviewerId=${id}`)
      .pipe(catchError(this.handleError));
  }

  getAllLineItems() {
    return this.http
      .get<LineItem[]>('/api/requestLines')
      .pipe(catchError(this.handleError));
  }

  getLineItemById(id: number) {
    return this.http
      .get<LineItem>(`/api/requestLines/${id}`)
      .pipe(catchError(this.handleError));
  }

  editLineItemById(id: number, data: LineItem) {
    return this.http
      .put<LineItem>(`/api/requestLines/${id}`, data)
      .pipe(catchError(this.handleError));
  }
  deleteLineItemById(id: number) {
    return this.http
      .delete(`/api/requestLines/${id}`)
      .pipe(catchError(this.handleError));
  }

  approveReview(requestId: number, reviewerId: number | undefined) {
    return this.http
      .put(`/api/requests/approve/${requestId}?reviewerId=${reviewerId}`, {})
      .pipe(catchError(this.handleError));
  }

  rejectRequest(
    requestId: number,
    reviewerId: number,
    rejectionReason: string
  ) {
    const url = `/api/requests/reject/${requestId}`;
    const params = {
      reviewerId: reviewerId.toString(),
      rejectionReason: rejectionReason,
    };

    return this.http.put(url, null, { params });
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => new Error('Something went wrong'));
  }
}
