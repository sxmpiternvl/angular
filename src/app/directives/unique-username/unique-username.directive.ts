import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { AuthService } from "../../services/auth-service";


@Directive({
  selector: '[appUsernameUnique]',
  standalone: true,
  providers: [{provide: NG_VALIDATORS, useExisting: UsernameValidatorDirective, multi: true}]
})
export class UsernameValidatorDirective implements Validator {
  constructor(private authService: AuthService) {}

  validate(formGroup: AbstractControl): ValidationErrors | null {
    const usernameControl = formGroup.get('username');
    if (!usernameControl) {
      return null;
    }

    const username = usernameControl.value;
    return this.authService.isUnique(username) ? null : { 'usernameNotUnique': 'Логин уже есть в системе' };
  }
}
