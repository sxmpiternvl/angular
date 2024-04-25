import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(matchTo: string): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value || !matchTo) {
      return null;
    }
    return control.value == matchTo ? null : { 'passwordMismatch': 'Пароли не совпадают.' };
  };
}

@Directive({
  selector: '[appPasswordMatch]',
  standalone: true,
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordMatchDirective, multi: true}]
})
export class PasswordMatchDirective implements Validator {
  @Input('appPasswordMatch') matchTo!: string;

  validate(control: AbstractControl) {
    return passwordMatchValidator(this.matchTo)(control);
  }
}
