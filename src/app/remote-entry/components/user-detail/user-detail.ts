import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user/user-service';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../../services/auth/model/auth.model';

@Component({
  selector: 'app-user-detail',
  imports: [
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCheckbox,
    ReactiveFormsModule,
  ],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetail implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  userForm!: FormGroup;
  userId!: number;

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: [''],
      isReviewer: [false],
      isAdmin: [false],
    });

    this.userId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.loadUserDetails();
  }
  routeUserList() {
    this.router.navigate(['/users']);
  }

  loadUserDetails() {
    this.userService
      .getUserById(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.userForm.patchValue(res);
        },
      });
  }

  handleEditDetails() {
    if (this.userForm.invalid) return;

    const updatedUser: User = { ...this.userForm.value, id: this.userId };

    this.userService
      .editUserById(this.userId, updatedUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.router.navigate(['/users']);
          this.userForm.reset();
        },
        error: (err) => {
          alert(err.message || 'Failed To Update User!');
        },
      });
  }
  handleDeleteUser() {
    this.userService
      .deleteUserById(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.router.navigate(['/users']);
        },
        error: (err) => {
          alert(err.message || 'Failed To Delete User');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
