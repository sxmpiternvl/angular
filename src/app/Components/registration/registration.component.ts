import {Component, EventEmitter, Output} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import {AuthService} from "../../services/auth-service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faExclamationTriangle, faLockOpen, faSave, faUser} from "@fortawesome/free-solid-svg-icons";
import {UsernameValidatorDirective} from "../../directives/unique-username/unique-username.directive";
import {PasswordMatchValidatorDirective} from "../../directives/password-match/password-match.directive";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FaIconComponent,
    UsernameValidatorDirective,
    PasswordMatchValidatorDirective,
  ],
  templateUrl: 'registration.component.html',
})
export class RegistrationComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z]*')]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z]*')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  registration() {
    if (this.registrationForm.valid) {
      const newUser = {
        ...this.registrationForm.value,
        uid: Date.now().toString(),
        balance: 10000,
        income: 0,
        outgoing: 0,
        currentBalance: 10000
      };
      this.authService.registration(newUser);
      this.authService.login(newUser.username, newUser.password);
      this.close.emit();
    }
  }
  closeModal(){
    this.close.emit();
  }

  protected readonly faSave = faSave;
  protected readonly Object = Object;
  protected readonly faLockOpen = faLockOpen;
  protected readonly faUser = faUser;
  protected readonly faExclamationTriangle = faExclamationTriangle;
}

