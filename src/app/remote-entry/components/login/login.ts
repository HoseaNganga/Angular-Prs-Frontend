import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Authservice } from '../../../services/auth/authservice';
import {
  LoginUser,
  LsUser,
  User,
} from '../../../services/auth/model/auth.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnDestroy {
  private readonly router = inject(Router);
  private readonly authService = inject(Authservice);
  private readonly destroy$ = new Subject<void>();

  username: string = '';
  password: string = '';
  errorMessage!: string;

  handleLogin() {
    const user: LoginUser = {
      username: this.username,
      password: this.password,
    };
    this.authService
      .authenticateUser(user)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: User) => {
          const lsData: LsUser = {
            firstname: res.firstname,
            email: res.email,
            id: res.id,
          };
          this.authService.setUser(lsData);
          this.router.navigate(['/users']);
        },
        error: (err: any) => {
          this.errorMessage = err || 'Invalid UserName or Password';
        },
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
