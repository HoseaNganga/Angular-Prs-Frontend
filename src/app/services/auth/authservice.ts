import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { LoginUser, LsUser, User } from './model/auth.model';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  private readonly httpService = inject(HttpClient);
  private readonly userSubject = new BehaviorSubject<LsUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    const storedUser = this.getStoredUser();
    if (storedUser) {
      this.userSubject.next(storedUser);
    }
  }

  getStoredUser(): LsUser | null {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  setUser(user: LsUser) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  clearUser() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  authenticateUser(data: LoginUser) {
    return this.httpService
      .post<User>(`/api/users/login`, data)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => new Error('Invalid username or password'));
  }
}
