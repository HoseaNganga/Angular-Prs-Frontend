import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { navLinks } from './models/nav.model';
import { Router, RouterModule } from '@angular/router';
import { LsUser } from '../../../../services/auth/model/auth.model';
import { Authservice } from '../../../../services/auth/authservice';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    CommonModule,
    MatButtonModule,
    RouterModule,
  ],
})
export class NavComponent implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly authService = inject(Authservice);
  private readonly router = inject(Router);

  navLinks: string[] = navLinks;
  userData: LsUser | null = null;
  active: boolean = true;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.userData = user;
    });
  }

  handleLogin() {
    this.router.navigate(['/login']);
  }

  handleLogOut() {
    this.authService.clearUser();
    this.router.navigate(['/login']);
  }
}
