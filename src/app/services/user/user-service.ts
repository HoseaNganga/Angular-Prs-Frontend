import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../auth/model/auth.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpService = inject(HttpClient);

  getAllUsers() {
    return this.httpService
      .get<User[]>(`/api/users`)
      .pipe(catchError(this.handleError));
  }

  createNewUser(data: User) {
    return this.httpService
      .post<User>(`/api/users`, data)
      .pipe(catchError(this.handleError));
  }

  getUserById(id: number) {
    return this.httpService
      .get<User>(`/api/users/${id}`)
      .pipe(catchError(this.handleError));
  }

  editUserById(id: number, data: User) {
    return this.httpService
      .put<User>(`/api/users/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteUserById(id: number) {
    return this.httpService
      .delete(`/api/users/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => new Error('Something went wrong'));
  }
}
