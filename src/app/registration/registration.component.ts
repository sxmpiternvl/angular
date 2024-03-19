import {Component} from '@angular/core';
import {AuthService} from "../auth-service";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
  ],
  template: `
    <h2>Registration Page</h2>
    <form class="" (ngSubmit)="registration()" #registrationForm="ngForm">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required minlength="3" [(ngModel)]="username" pattern="[a-zA-Z]*">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required minlength="6" [(ngModel)]="password">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required minlength="3" [(ngModel)]="name" pattern="[a-zA-Z]*">
        <label for="lastname">lastname:</label>
        <input type="text" id="lastname" name="lastname" required minlength="3" [(ngModel)]="lastname" pattern="[a-zA-Z]*">
        <div class="error" *ngIf="error">username already exists</div>
      </div>
      <button type="submit" [disabled]="!registrationForm.valid">Registration</button>
    </form>
  `,
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  constructor(private authService: AuthService, private router: Router) {
  }

  username: string = '';
  password: string = '';
  name: string = '';
  lastname: string = '';
  balance: number = 0;
  error: boolean = false;

  registration(): void {
    if (!this.authService.isUnique(this.username)) {
      this.error = true;
      return;
    }
    if (this.username && this.password && this.name && this.lastname) {
      this.authService.registration(this.username, this.password, this.name, this.lastname, this.balance);
      this.authService.login(this.username, this.password);
      this.router.navigate(['/']);
    }
  }
}
