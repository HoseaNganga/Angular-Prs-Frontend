import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  displayedRequestColumns,
  RequestInterface,
} from './models/request.model';
import { Subject, takeUntil } from 'rxjs';
import { RequestService } from '../../../services/request/request-service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-requests',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './requests.html',
  styleUrl: './requests.scss',
})
export class Requests implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly requestService = inject(RequestService);
  private readonly destroy$ = new Subject<void>();
  displayedColumns = displayedRequestColumns;
  requestsList!: RequestInterface[];

  ngOnInit(): void {
    this.getAllRequests();
  }

  getAllRequests() {
    this.requestService
      .getAllRequests()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (val: RequestInterface[]) => {
          this.requestsList = val;
        },
      });
  }

  routeRequestCreate() {
    this.router.navigate(['/request/create']);
  }
  routeRequestEdit(id: number) {
    this.router.navigate([`/request/details/${id}`]);
  }

  routeRequestLine(id: number) {
    this.router.navigate([`request-line/create/${id}`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
