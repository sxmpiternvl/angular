import {Directive, Inject} from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, Validator, NG_VALIDATORS } from '@angular/forms';
import { AuthService } from './services/auth-service';

export const regValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const errors: ValidationErrors = {};
  const username = control.get('username');
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  const authService = Inject(AuthService)

  if (username && !username.pristine) {
    errors['notUnique'] = 'Логин уже занят';
  }
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    errors['passwordMismatch'] = 'Пароли не совпадают';
  }
  return Object.keys(errors).length > 0 ? errors : null;
};

@Directive({
  selector: '[appRegError]',
  standalone: true,
  providers: [{provide: NG_VALIDATORS, useExisting: RegErrorDirective, multi: true}]
})
export class RegErrorDirective implements Validator {
  constructor(private authService: AuthService) {}

  validate(control: AbstractControl): ValidationErrors | null {
    return regValidator(control);
  }
}
