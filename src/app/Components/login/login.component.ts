import {Component, HostBinding} from '@angular/core';
import {AuthService} from "../../services/auth-service";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {faFingerprint, faUsers} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faLockOpen} from "@fortawesome/free-solid-svg-icons";
import {faLock} from "@fortawesome/free-solid-svg-icons";
import {faCalendar} from "@fortawesome/free-solid-svg-icons";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
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
  styleUrl: './login.component.css'
})
export class LoginComponent {
  faUsers = faUsers;
  exTriangle = faExclamationTriangle;
  faCalendar = faCalendar;
  faUser = faUser;
  faLock = faLock;
  faLockOpen = faLockOpen;
  faFinger = faFingerprint;
  username: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  login(): void {
    if (this.authService.login(this.username, this.password)) {
      setTimeout(() => {
        this.router.navigate(['/operations']);
      }, 100);
    } else {
      this.loginError = true;
    }
  }
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

}
