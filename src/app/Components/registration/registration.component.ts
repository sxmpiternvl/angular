import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth-service";
import {FormsModule, NgModel} from "@angular/forms";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {UserInterface} from "../../interface/user";
import {faExclamationTriangle, faLockOpen, faSave, faUser} from "@fortawesome/free-solid-svg-icons";
import {PasswordMatchDirective} from "../../directives/password-match/password-match.directive";

@Component({
  selector: 'app-registration',
  standalone: true,
  animations: [],
  imports: [
    FormsModule,
    CommonModule,
    FaIconComponent,
    PasswordMatchDirective,
  ],
  templateUrl: 'registration.component.html',

})
export class RegistrationComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('confirmPasswordModel') confirmPasswordModel!: NgModel;

  constructor(private authService: AuthService, private router: Router) {
  }
  newUser: UserInterface = {
    uid: Date.now().toString(),
    username: '',
    password: '',
    name: '',
    balance: 10000,
    income: 0,
    outgoing: 0,
    currentBalance: 10000,
  };
  uid: string = Date.now().toString();
  confirmPassword: string = '';
  error: boolean = false;
  errorMessages: Array<string>= [];

  closeModal(){
    this.close.emit();
  }

  isSpace(event: any) {
    if (event.key == ' ') {
      event.preventDefault();
    }
  }

  validateUsername() {
    if (!this.authService.isUnique(this.newUser.username)) {
      if(!this.errorMessages.includes("Логин уже есть в системе.")){
      this.errorMessages.push("Логин уже есть в системе.");
    }
    }else {
      this.errorMessages = this.errorMessages.filter(msg => msg != "Логин уже есть в системе.");
    }
  }

  validatePasswords() {
    if (this.newUser.password != this.confirmPassword ) {
    if(!this.errorMessages.includes("Пароли не совпадают") && (this.newUser.password && this.confirmPassword.length !=0)){
      this.errorMessages.push("Пароли не совпадают");
    }
    } else {
      this.errorMessages = this.errorMessages.filter(msg => msg != "Пароли не совпадают");
    }
  }

  registration() {
    if (this.errorMessages.length == 0) {
      this.authService.registration(this.newUser);
      this.authService.login(this.newUser.username, this.newUser.password);
      this.close.emit();
    }
  }

  protected readonly faUser = faUser;
  protected readonly faLockOpen = faLockOpen;
  protected readonly faSave = faSave;
  protected readonly faExclamationTriangle = faExclamationTriangle;
}
