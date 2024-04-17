import {Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from "../../services/auth-service";
import {FormsModule} from "@angular/forms";
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
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

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
    currentBalance: 10000
  };
  uid: string = Date.now().toString();
  confirmPassword: string = '';
  error: boolean = false;
  errorMessage = '';

  registration(): void {
    if (!this.authService.isUnique(this.newUser.username) || this.newUser.password != this.confirmPassword) {
      this.error = true;
      if(!this.authService.isUnique(this.newUser.username) && this.newUser.password != this.confirmPassword){
        this.errorMessage =" Логин уже есть в системе. \n Пароли не совпадают ";
        return;
      }
      this.errorMessage = !this.authService.isUnique(this.newUser.username) ? "Логин уже есть в системе." : "Пароли не совпадают";
      return;
    }
    this.authService.registration(this.newUser);
    this.authService.login(this.newUser.username, this.newUser.password);
    this.close.emit();
  }
  closeModal(){
    this.close.emit();
  }

  isSpace(event: any) {
    if (event.key == ' ') {
      event.preventDefault();
    }
  }
  get passwordsMatch(): boolean {
    return this.newUser.password == this.confirmPassword;
  }

  protected readonly faUser = faUser;
  protected readonly faLockOpen = faLockOpen;
  protected readonly faSave = faSave;
  protected readonly faExclamationTriangle = faExclamationTriangle;
}
