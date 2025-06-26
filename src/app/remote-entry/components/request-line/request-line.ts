import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user/user-service';
import { RequestService } from '../../../services/request/request-service';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../../services/auth/model/auth.model';
import { RequestInterface } from '../requests/models/request.model';
import {
  displayedRequestLineColumns,
  displayedRequestLineItemsColumns,
  LineItem,
} from './model/request-line.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-line',
  imports: [MatIconModule, MatButtonModule, CommonModule, RouterModule],
  templateUrl: './request-line.html',
  styleUrl: './request-line.scss',
})
export class RequestLine implements OnInit {
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
  displayedColumns: string[] = displayedRequestLineColumns;
  displayedLineColumns: string[] = displayedRequestLineItemsColumns;
  allLineItems: any[] = [];
  filteredLineItems: LineItem[] = [];

  ngOnInit(): void {
    this.requestId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    this.loadRequestDetails();
    this.loadFilteredLineItems();
  }

  loadRequestDetails() {
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
  routeRequestList() {
    this.router.navigate(['/requests']);
  }

  handleRouteRequestLineCreate() {
    this.router.navigate([`/request-line/create/${this.requestId}`]);
  }

  routeRequestEdit(id: number) {
    this.router.navigate([`/request/details/${id}`]);
  }

  handleSubmitReview() {
    this.requestService
      .submitRequestForReview(this.requestId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.router.navigate(['/requests']);
        },
        error: (err) => {
          alert(err.message || 'Failed To Submit Request For Review');
        },
      });
  }
}
