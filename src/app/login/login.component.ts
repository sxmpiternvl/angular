import {Component, HostBinding} from '@angular/core';
import {AuthService} from "../auth-service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {faFingerprint} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faLockOpen} from "@fortawesome/free-solid-svg-icons";
import {faLock} from "@fortawesome/free-solid-svg-icons";
import {faCalendar} from "@fortawesome/free-solid-svg-icons";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {routeAnimationState} from "../route.animations";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    FaIconComponent
  ],
  template: `
    <div class="bg-neutral-100 fixed top-0 left-0 h-screen w-full">
      <div class="absolute left-[39%] top-[15%] bg-white p-8 rounded-2xl w-[22%] shadow-md text-blue-700 ">
        <div class="text-center">
          <fa-icon [icon]="faFinger" class="text-blue-700 text-[72px]"></fa-icon>
        </div>
        <h2 class="text-2xl text-center pb-6 text-black">Вход в систему</h2>
        <form (ngSubmit)="login()" #loginForm="ngForm">
          <div class="relative">
            <label for="username">Логин</label>

            <input type="text" id="username" name="username" required minlength="3" [(ngModel)]="username"
                   pattern="[a-zA-Z]*" class=" bg-blue-100 pl-10">
            <i>
              <fa-icon [icon]="faUser" class="absolute text-blue-700 left-3 top-10"></fa-icon>
            </i>
            <i>
              <fa-icon [icon]="faCalendar" class="text-blue-700 absolute right-3 top-10"></fa-icon>
            </i>
          </div>
          <div class="relative">
            <label for="password">Пароль</label>
            <input type="password" id="password" name="password" required minlength="6" [(ngModel)]="password"
                   class=" bg-blue-100 pl-10">
            <i>
              <fa-icon [icon]="faLock" class="text-blue-700 absolute left-3 top-10"></fa-icon>
            </i>
          </div>
          <div id="newOperation" (click)="login()"
               class="custom-submit-button">
            <fa-icon [icon]="faLockOpen" class="text-blue-700 px-2"></fa-icon>
            <button type="submit"> Войти в систему</button>
          </div>
          <div *ngIf="loginError"
               class="error-block">
            <div class="alert ">
              <fa-icon [icon]="exTriangle" class="text-error px-4"></fa-icon>
              <div class="flex flex-col py-0">
                <h1>I</h1>
                <h1>I</h1>
                <h1>I</h1>
              </div>
              <p class="px-2">Неверный логин или пароль. Повторите попытку</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  animations: [routeAnimationState],
  //
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @HostBinding('@routeAnimationTrigger') routeAnimation = true;
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
      this.router.navigate(['/operations']);
    } else {
      this.loginError = true;
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}
