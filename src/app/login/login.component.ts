import {Component} from '@angular/core';
import {AuthService} from "../auth-service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  template: `
    <h2 class="text-2xl">Login Page</h2>
    <form (ngSubmit)="login()" #loginForm="ngForm">
      <div class="form">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required minlength="3" [(ngModel)]="username" pattern="[a-zA-Z]*">
      </div>
      <div class="form">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required minlength="6" [(ngModel)]="password">
      </div>
      <button type="submit" [disabled]="!loginForm.valid">Login</button>
      <div class="error" *ngIf="loginError">Invalid username or password</div>
    </form>
  `,
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  login(): void {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/']);
    } else {
      this.loginError = true;
    }
  }
}
