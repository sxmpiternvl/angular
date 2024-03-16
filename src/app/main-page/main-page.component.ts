import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {AuthService} from "../auth-service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
  ],
  template: `
    <p>Main Page.</p>
    <nav>
      <p *ngIf="getCurrentUsername()">user:{{getCurrentUsername()}}</p>
      <ul>
        <li *ngIf="!isLoggedIn()"><a routerLink="/login">Sign In</a></li>
        <li *ngIf="!isLoggedIn()"><a routerLink="/registration">Sign Up</a>
        </li>
        <li><a routerLink="/operations">Operations</a></li>
        <li><a routerLink="/balances">Balances</a></li>
      </ul>
      <button (click)="logout()" *ngIf="isLoggedIn()">Logout</button>
    </nav>

  `,
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

  constructor(private authService: AuthService) {
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }

  getCurrentUsername(): string {
    return this.authService.getCurrentUsername();
  }
}
