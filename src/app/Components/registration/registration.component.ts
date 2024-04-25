import {Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from "../../services/auth-service";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {UserInterface} from "../../interface/user";
import {faLockOpen, faSave, faUser} from "@fortawesome/free-solid-svg-icons";
import {PasswordMatchDirective} from "../../directives/password-match/password-match.directive";
import {UsernameValidatorDirective} from "../../directives/unique-username/unique-username.directive";

@Component({
  selector: 'app-registration',
  standalone: true,
  animations: [],
  imports: [
    FormsModule,
    CommonModule,
    FaIconComponent,
    PasswordMatchDirective,
    UsernameValidatorDirective,
  ],
  templateUrl: 'registration.component.html',

})
export class RegistrationComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  constructor(private authService: AuthService) {
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


  closeModal(){
    this.close.emit();
  }

  isSpace(event: any) {
    if (event.key == ' ') {
      event.preventDefault();
    }
  }
  registration() {
      this.authService.registration(this.newUser);
      this.authService.login(this.newUser.username, this.newUser.password);
      this.close.emit();
  }

  protected readonly faUser = faUser;
  protected readonly faLockOpen = faLockOpen;
  protected readonly faSave = faSave;
  // protected readonly faExclamationTriangle = faExclamationTriangle;
}
