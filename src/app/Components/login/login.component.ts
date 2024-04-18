import {Component} from '@angular/core';
import {AuthService} from "../../services/auth-service";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  faCalendar,
  faExclamationTriangle,
  faFingerprint,
  faLock,
  faLockOpen,
  faUser
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    FaIconComponent,
    RouterLink
  ],
  templateUrl: 'login.component.html',

})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  login(): void {
    if (this.authService.login(this.username, this.password)) {
        this.router.navigate(['/operations']);
    } else {
      this.loginError = true;
    }
  }
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  protected readonly faUser = faUser;
  protected readonly faFingerprint = faFingerprint;
  protected readonly faCalendar = faCalendar;
  protected readonly faLock = faLock;
  protected readonly faLockOpen = faLockOpen;
  protected readonly faExclamationTriangle = faExclamationTriangle;
}
