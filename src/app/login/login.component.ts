import {Component} from '@angular/core';
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
import {extractInterface} from "@angular/compiler-cli/src/ngtsc/docs/src/class_extractor";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    FaIconComponent
  ],
  template: `
    <section class="bg-neutral-100 absolute top-0 left-0 h-screen w-full">
      <section class="fixed left-[39%] top-[15%] bg-white p-8 rounded-2xl w-[22%] shadow-md text-blue-700 ">
        <div class="text-center">
          <fa-icon [icon]="faFinger" class="text-blue-700 text-[72px]"></fa-icon>
        </div>
        <h2 class="text-2xl text-center pb-6 text-black">Вход в систему</h2>
        <form (ngSubmit)="login()" #loginForm="ngForm">
          <div>
            <label for="username">Логин</label>
            <input type="text" id="username" name="username" required minlength="3" [(ngModel)]="username"
                   pattern="[a-zA-Z]*" class=" bg-blue-100 pl-10">
            <i>
              <fa-icon [icon]="faUser" class="text-blue-700 absolute left-12 top-[56%]"></fa-icon>
            </i>
            <i>
              <fa-icon [icon]="faCalendar" class="text-blue-700 absolute right-16 top-[56%]"></fa-icon>
            </i>
          </div>
          <div>
            <label for="password">Пароль</label>
            <input type="password" id="password" name="password" required minlength="6" [(ngModel)]="password"
                   class=" bg-blue-100 pl-10">
            <i>
              <fa-icon [icon]="faLock" class="text-blue-700 absolute left-12 top-[75%]"></fa-icon>
            </i>
          </div>
          <div id="newOperation"
               class="custom-submit-button">
            <fa-icon [icon]="faLockOpen" class="text-blue-700 px-2"></fa-icon>
            <button type="submit">Войти в систему</button>
          </div>
          <div *ngIf="loginError"
               class="error-block w-[22%] left-[39%]">
            <div class="alert flex justify-center">
              <fa-icon [icon]="exTriangle" class="text-red-700 pl-6 py-4"></fa-icon>
              <p>Неверный логин или пароль. Повторите попытку</p>
            </div>
          </div>
        </form>
      </section>
    </section>
  `,
  //
  styleUrl: './login.component.css'
})
export class LoginComponent {
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
