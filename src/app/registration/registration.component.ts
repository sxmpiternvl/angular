import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from "../auth-service";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faLock} from "@fortawesome/free-solid-svg-icons";

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
        <div class="flex flex-col gap-2">
          <div>
            <label for="name">Имя:</label>
            <input class="pl-8" type="text" id="name" name="name" required minlength="3" [(ngModel)]="name"
                   pattern="[a-zA-Z]*">
            <i>
              <fa-icon [icon]="faLock" class="text-blue-700 absolute left-11 top-[115px]"></fa-icon>
            </i>
          </div>
          <div>
            <label for="username">Логин:</label>
            <input class="pl-8" type="text" id="username" name="username" required minlength="3" [(ngModel)]="username"
                   pattern="[a-zA-Z]*">
            <i>
              <fa-icon [icon]="faLock" class="text-blue-700 absolute left-11 top-[204px]"></fa-icon>
            </i>

          </div>
          <div>
            <label for="password">Пароль:</label>
            <input class="pl-8" type="password" id="password" name="password" required minlength="6"
                   [(ngModel)]="password">
            <i>
              <fa-icon [icon]="faLock" class="text-blue-700 absolute left-11 top-[293px]"></fa-icon>
            </i>
          </div>
          <div>
            <label for="confirmPassword">Повторите пароль:</label>
            <input class="pl-8" type="password" id="confirmPassword" name="confirmPassword" required minlength="6"
                   [(ngModel)]="confirmPassword">
            <i>
              <fa-icon [icon]="faLock" class="text-blue-700 absolute left-11 top-[382px]"></fa-icon>
            </i>
          </div>
          <div class="flex items-center gap-2 text-blue-700">
            <input type="checkbox" class="w-fit h-4 mr-2 border-blue-700 border-2 p-2" id="checkbox">
            <label for="checkbox" class="text-blue-700">Запомнить меня</label>
          </div>
          <div class="custom-submit-button">
            <button type="submit" [disabled]="!registrationForm.valid">Создать пользователя</button>
          </div>
        </div>
        <div *ngIf="error"
             class="bg-white rounded-b-2xl  text-error shadow-md pt-4">
          <div class="alert">
            <fa-icon [icon]="faLock" class="text-error"></fa-icon>
            <p>Логин уже есть в системе. Пароли не совпадают </p>
          </div>
        </div>
      </form>
    </div>

    <div class="absolute right-2 top-2">
      <button (click)="this.cancel.emit()">
        x
      </button>
    </div>
  `,
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  faLock = faLock;

  constructor(private authService: AuthService, private router: Router) {
  }

  confirmPassword: string = '';
  username: string = '';
  password: string = '';
  name: string = '';
  balance: number = 0;
  error: boolean = false;

  registration(): void {
    if (!this.authService.isUnique(this.username)) {
      this.error = true;
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = true;
      return;
    }
    if (this.username && this.password && this.name) {
      this.authService.registration(this.username, this.password, this.name);
      this.authService.login(this.username, this.password);
      this.router.navigate(['operations']);
    }
  }
}
