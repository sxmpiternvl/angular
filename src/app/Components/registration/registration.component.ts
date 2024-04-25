import {Component, EventEmitter, Output} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';
import {AuthService} from "../../services/auth-service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faLockOpen, faSave, faUser} from "@fortawesome/free-solid-svg-icons";
import {NgIf, NgForOf} from "@angular/common";
import {UsernameValidatorDirective} from "../../directives/unique-username/unique-username.directive";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FaIconComponent,
    NgIf,
    NgForOf,
    UsernameValidatorDirective,
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
    }, {validators: [ this.collectAllErrors()]});
  }

  collectAllErrors(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const errors: ValidationErrors = {};
        const username = form.get('username');
        const password = form.get('password');
        const confirmPassword = form.get('confirmPassword');
        if (password && confirmPassword && password.value != confirmPassword.value) {
          errors['passwordMismatch'] = ['Пароли не совпадают'];
        }
        else if(!this.authService.isUnique(username?.value)){
          errors['notUnique'] = ['Логин уже занят'];
        }
        // Object.keys(form.controls).forEach(key => {
        //   const control = form.get(key);
        //   if (control && control.errors) {
        //     errors[key] = [];
        //     Object.keys(control.errors).forEach(errorKey => {
        //       if (errorKey == 'required') {
        //         errors[key].push(`Поле ${key} обязательно для заполнения.`);
        //       } else if (errorKey == 'minlength') {
        //         errors[key].push(`Поле ${key} должно быть не менее 5 символов.`);
        //       } else if (errorKey == 'pattern') {
        //         errors[key].push(`Поле ${key} содержит недопустимые символы.`);
        //       }
        //     });
        //   }
        // });
      return Object.keys(errors).length > 0 ? errors : null;
    };
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

  protected readonly faSave = faSave;
  protected readonly Object = Object;
  protected readonly faLockOpen = faLockOpen;
  protected readonly faUser = faUser;
}
