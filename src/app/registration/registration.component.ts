import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from "../auth-service";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-registration',
  standalone: true,
  animations: [],
  imports: [
    FormsModule,
    CommonModule,
  ],
  template: `
@if(a){
    <section class="bg-black absolute top-0 left-0 h-full w-full bg-opacity-40">
      <section class="bg-white absolute top-[15%] left-[37%] h-auto w-[26%] overflow-hidden border-0 rounded-2xl p-4">
        <div class="absolute right-2 top-2">
          <button (click)="this.close.emit()">
             x
          </button>
        </div>
        <h2>Создание пользователя</h2>
        <form class="" (ngSubmit)="registration()" #registrationForm="ngForm">
          <div>
            <label for="name">Имя:</label>
            <input type="text" id="name" name="name" required minlength="3" [(ngModel)]="name" pattern="[a-zA-Z]*">
            <label for="username">Логин:</label>
            <input type="text" id="username" name="username" required minlength="3" [(ngModel)]="username"
                   pattern="[a-zA-Z]*">
            <label for="password">Пароль:</label>
            <input type="password" id="password" name="password" required minlength="6" [(ngModel)]="password">
            <label for="confirmPassword">Повторите пароль:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required minlength="6" [(ngModel)]="confirmPassword">
            <div class="flex items-center gap-2 text-blue-700">
              <input type="checkbox" class="w-fit h-4 mr-2 border-blue-700 border-2 p-2" id="checkbox">
              <label for="checkbox" class="text-blue-700">Запомнить меня</label>
            </div>
          </div>
          <div class="border-blue-700 p-2 border-2 text-center rounded-2xl text-blue-700 hover:bg-blue-700 hover:text-white duration-500">
            <button class="hover:bg-blue-700" type="submit" [disabled]="!registrationForm.valid">Создать пользователя</button>
          </div>
          <div class="error" *ngIf="error">username already exists</div>
        </form>
      </section>
    </section>
}
  `,
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  @Input('a')
  a = false;
  @Output('close')
  close = new EventEmitter();

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
