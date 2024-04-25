import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthService } from "../../services/auth-service";

export function usernameUniqueValidator(authService: AuthService): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) {
      return null;
    }
    return authService.isUnique(control.value) ? null : { 'usernameNotUnique': true };
  };
}

@Directive({
  selector: '[appUsernameUnique]',
  standalone: true,
  providers: [{provide: NG_VALIDATORS, useExisting: UsernameValidatorDirective, multi: true}]
})
export class UsernameValidatorDirective implements Validator {
  constructor(private authService: AuthService) {}

  validate(control: AbstractControl) {
    return usernameUniqueValidator(this.authService)(control);
  }
}
