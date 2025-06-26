import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../../../services/request/request-service';
import { Subject, takeUntil } from 'rxjs';
import {
  displayedRequestColumns,
  RequestInterface,
} from '../requests/models/request.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Authservice } from '../../../services/auth/authservice';

@Component({
  selector: 'app-review',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './review.html',
  styleUrl: './review.scss',
})
export class Review implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly requestService = inject(RequestService);
  private readonly authService = inject(Authservice);
  private readonly destroy$ = new Subject<void>();
  displayedColumns = displayedRequestColumns;
  requestsList!: RequestInterface[];
  reviewerId!: number | undefined;

  ngOnInit(): void {
    const id = this.authService.getStoredUser();
    this.reviewerId = id?.id;
    this.getAllReviews();
  }

  ApproveRequest(id: number) {
    this.router.navigate([`/request/review/${id}`]);
  }
 

  getAllReviews() {
    this.requestService
      .getAllReviews(this.reviewerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (val: RequestInterface[]) => {
          this.requestsList = val;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
