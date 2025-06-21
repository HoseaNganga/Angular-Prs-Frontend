import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatOption } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from '../../../services/user/user-service';
import { RequestService } from '../../../services/request/request-service';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../../services/auth/model/auth.model';
import { RequestInterface } from '../requests/models/request.model';
import { Authservice } from '../../../services/auth/authservice';

@Component({
  selector: 'app-request-create',
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
  templateUrl: './request-create.html',
  styleUrl: './request-create.scss',
})
export class RequestCreate implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly requestService = inject(RequestService);
  private readonly authService = inject(Authservice);
  requestForm!: FormGroup;
  private readonly destroy$ = new Subject<void>();
  userList!: User[];

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      description: ['', Validators.required],
      justification: ['', Validators.required],
      deliveryMode: ['', Validators.required],
    });
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: User[]) => {
          this.userList = res;
        },
      });
  }

  routeRequestList() {
    this.router.navigate(['/requests']);
  }

  handleSubmit() {
    if (this.requestForm.invalid) return;

    const loggedInUser = this.authService.getStoredUser();
    if (!loggedInUser) {
      alert('You must be logged in to create a request.');
      return;
    }

    const newRequest: RequestInterface = {
      ...this.requestForm.value,
      user: {
        id: loggedInUser.id,
      },
    };

    this.requestService
      .createNewRequest(newRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.router.navigate(['/requests']);
          this.requestForm.reset();
        },
        error: (err) => {
          alert(err.message || 'An error occured creating a Request!');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
