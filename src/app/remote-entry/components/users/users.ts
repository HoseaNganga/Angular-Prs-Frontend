import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../services/user/user-service';
import { User } from '../../../services/auth/model/auth.model';
import { Subject, takeUntil } from 'rxjs';
import { displayedUserColumns } from './models/user.model';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [MatButtonModule, MatTableModule, CommonModule, MatIconModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private readonly destroy$ = new Subject<void>();
  private readonly router = inject(Router);

  userList!: User[];
  displayedColumns = displayedUserColumns;

  ngOnInit(): void {
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

  routeUserCreate() {
    this.router.navigate(['user/create']);
  }
  routeUserEdit(id: number) {
    this.router.navigate([`user/details/${id}`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
