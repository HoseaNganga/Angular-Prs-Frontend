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
import { Router } from '@angular/router';
import { User } from '../../../services/auth/model/auth.model';
import { UserService } from '../../../services/user/user-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-create',
  imports: [
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCheckbox,
    ReactiveFormsModule,
  ],
  templateUrl: './user-create.html',
  styleUrl: './user-create.scss',
})
export class UserCreate implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  userForm!: FormGroup;
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      isReviewer: [false],
      isAdmin: [false],
    });
  }

  handleSubmit() {
    if (this.userForm.invalid) return;

    const newUser: User = this.userForm.value;

    this.userService
      .createNewUser(newUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.router.navigate(['/users']);
          this.userForm.reset();
        },
        error: (err) => {
          alert(err.message || 'An error occured creating a User!');
        },
      });
  }

  routeUserList() {
    this.router.navigate(['/users']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
