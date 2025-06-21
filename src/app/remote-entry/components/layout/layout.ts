import { Component } from '@angular/core';
import { NavComponent } from '../global/nav/nav.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [NavComponent, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {}
