import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from "../auth-service";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faLock} from "@fortawesome/free-solid-svg-icons";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {faUser} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-registration',
  standalone: true,
  animations: [],
  imports: [
    FormsModule,
    CommonModule,
    FaIconComponent,
  ],
  template: `
    <div>
      <h2 class="text-2xl pb-3">Создание пользователя</h2>
      <form class="" (ngSubmit)="registration()" #registrationForm="ngForm">
        <div>
          <div class="flex flex-col gap-2">
            <div>
              <label for="name">Имя:</label>
              <input class="px-2" type="text" id="name" name="name" required minlength="3" [(ngModel)]="name"
                     pattern="[a-zA-Z]*">
              <i>
                <fa-icon [icon]="faUser" class="text-black absolute right-11 top-[115px]"></fa-icon>
              </i>
            </div>
            <div>
              <label for="username">Логин:</label>
              <input class="px-2" type="text" id="username" name="username" required minlength="3"
                     [(ngModel)]="username"
                     pattern="[a-zA-Z]*">
              <i>
                <fa-icon [icon]="faUser" class="text-black absolute right-11 top-[204px]"></fa-icon>
              </i>

            </div>
            <div>
              <label for="password">Пароль:</label>
              <input class="pl-8" type="password" id="password" name="password" required minlength="6"
                     [(ngModel)]="password">
              <i>
                <fa-icon [icon]="faLock" class="text-black absolute left-11 top-[293px]"></fa-icon>
              </i>
            </div>
            <div>
              <label for="confirmPassword">Повторите пароль:</label>
              <input class="pl-8" type="password" id="confirmPassword" name="confirmPassword" required minlength="6"
                     [(ngModel)]="confirmPassword">
              <i>
                <fa-icon [icon]="faLock" class="text-black absolute left-11 top-[382px]"></fa-icon>
              </i>
            </div>
            <div class="flex items-center gap-2 text-blue-700">
              <input type="checkbox" class="w-fit h-4 mr-2 border-blue-700 border-2 p-2" id="checkbox">
              <label for="checkbox" class="text-blue-700">Запомнить меня</label>
            </div>
            <div id="newOperation" class="custom-submit-button text-primary">
              <i>
                <fa-icon [icon]="faSave" class=" pr-2 text-primary "></fa-icon>
              </i>
              <button type="submit">Создать пользователя</button>
              <!--            [disabled]="!registrationForm.valid"-->
            </div>
          </div>
          <div *ngIf="error"
               class="error-block">
            <div class="alert">
              <fa-icon [icon]="faLock" class="text-error px-4"></fa-icon>
              <div class="border-l border-error px-4">
                <p class=" px-4">Логин уже есть в
                  системе.<br>
                  Пароли не совпадают </p>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>

    <div class="absolute right-2 top-2">
      <button (click)="this.close.emit()">
        x
      </button>
    </div>
  `,
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  faLock = faLock;
  faSave = faSave;
  faUser = faUser;

  constructor(private authService: AuthService, private router: Router) {
  }

  uid: string = Date.now().toString();
  confirmPassword: string = '';
  username: string = '';
  password: string = '';
  name: string = '';
  balance: number = 10000;
  income = 0;
  outgoing = 0;
  error: boolean = false;
currentBalance = this.balance-this.outgoing+this.income;

  registration(): void {
    if (!this.authService.isUnique(this.username) || this.password != this.confirmPassword) {
      this.error = true;
      return;
    }
    if (this.username && this.password && this.name && this.uid) {
      this.authService.registration(this.username, this.password, this.name, this.uid, this.income, this.outgoing, this.currentBalance, this.balance);
      this.authService.login(this.username, this.password);
      this.router.navigate(['operations']);
    }
  }
}
