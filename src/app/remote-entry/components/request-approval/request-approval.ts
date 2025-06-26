import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../../services/request/request-service';
import { Subject, takeUntil } from 'rxjs';
import { RequestInterface } from '../requests/models/request.model';
import {
  displayedRequestLineColumns,
  displayedRequestLineItemsColumns,
  LineItem,
} from '../request-line/model/request-line.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Authservice } from '../../../services/auth/authservice';

@Component({
  selector: 'app-request-approval',
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './request-approval.html',
  styleUrl: './request-approval.scss',
})
export class RequestApproval implements OnInit {
  private readonly router = inject(Router);
  private readonly requestService = inject(RequestService);
  private readonly destroy$ = new Subject<void>();
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(Authservice);
  private readonly fb = inject(FormBuilder);
  displayedColumns = displayedRequestLineColumns;
  displayedLineColumns: string[] = displayedRequestLineItemsColumns;
  requestId!: number;
  requestData!: RequestInterface;
  allLineItems: any[] = [];
  filteredLineItems: LineItem[] = [];
  rejectionForm!: FormGroup;
  reviewerId!: number | undefined;

  ngOnInit(): void {
    const id = this.authService.getStoredUser();
    this.reviewerId = id?.id;
    this.requestId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getRequestData();
    this.loadFilteredLineItems();
    this.rejectionForm = this.fb.group({
      reason: [''],
    });
  }

  routeRequest() {
    this.router.navigate(['/reviews']);
  }
  get reasonControl(): FormControl {
    return this.rejectionForm.get('reason') as FormControl;
  }
  get showRejectButton(): boolean {
    return !!this.rejectionForm.get('reason')?.value.trim();
  }

  getRequestData() {
    this.requestService
      .getRequestById(this.requestId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.requestData = res;
        },
        error: (err) => {
          alert(err.message || 'Unable To Fetch Request Details');
        },
      });
  }
  loadFilteredLineItems() {
    this.requestService
      .getAllLineItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (lineItems) => {
          this.allLineItems = lineItems;
          this.filteredLineItems = this.allLineItems.filter(
            (item) => item.request.id === this.requestId
          );

          console.log(this.filteredLineItems);
        },
        error: (err) => {
          alert('Failed to load line items');
        },
      });
  }

  ApproveRequest() {
    this.requestService
      .approveReview(this.requestId, this.reviewerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          alert(`Successful Approval `);
          this.router.navigate(['/requests']);
        },
        error: (err) => {
          alert(err.message || 'An error Occured during Approval. Try Again!');
        },
      });
  }

  rejectRequest() {
    const reason = this.rejectionForm.get('reason')?.value.trim();
    if (!reason || !this.reviewerId) return;

    this.requestService
      .rejectRequest(this.requestId, this.reviewerId, reason)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          alert('Request rejected successfully.');
          this.router.navigate(['/requests']);
        },
        error: (err) => {
          alert(err.message || 'Rejection failed. Please try again.');
        },
      });
  }
}
