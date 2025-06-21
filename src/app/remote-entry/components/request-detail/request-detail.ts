import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatOption } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user/user-service';
import { RequestService } from '../../../services/request/request-service';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../../services/auth/model/auth.model';
import { RequestInterface } from '../requests/models/request.model';

@Component({
  selector: 'app-request-detail',
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
  templateUrl: './request-detail.html',
  styleUrl: './request-detail.scss',
})
export class RequestDetail implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly requestService = inject(RequestService);
  private readonly activatedRoute = inject(ActivatedRoute);
  requestForm!: FormGroup;
  private readonly destroy$ = new Subject<void>();
  userList!: User;
  requestId!: number;
  requestData!: RequestInterface;

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      description: ['', Validators.required],
      justification: ['', Validators.required],
      deliveryMode: ['', Validators.required],
      user: ['', Validators.required],
    });

    this.requestId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.loadRequestDetails();
  }

  loadRequestDetails() {
    this.requestService
      .getRequestById(this.requestId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.requestData = res;
          this.requestForm.patchValue(res);
        },
        error: (err) => {
          alert(err.message || 'Unable To Fetch Request Details');
        },
      });
  }

  routeRequestList() {
    this.router.navigate(['/requests']);
  }

  handleEditDetails() {
    if (this.requestForm.invalid) return;

    const updatedRequest: RequestInterface = {
      ...this.requestForm.value,
      id: this.requestId,
      status: this.requestData.status,
      total: this.requestData.total,
      submittedDate: this.requestData.submittedDate,
      requestNumber: this.requestData.requestNumber,
      rejectionReason: this.requestData.rejectionReason ?? null,
    };

    this.requestService
      .editRequestById(this.requestId, updatedRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.router.navigate(['/requests']);
          this.requestForm.reset();
        },
        error: (err) => {
          alert(err.message || 'Failed To Update Request!');
        },
      });
  }

  handleDeleteRequest() {
    this.requestService
      .deleteRequestById(this.requestId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.router.navigate(['/requests']);
        },
        error: (err) => {
          alert(err.message || 'Failed To Delete Request');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
