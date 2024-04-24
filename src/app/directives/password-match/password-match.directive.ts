import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordMatcher(targetPassword: string): ValidatorFn {
  return (control: AbstractControl)=> {
    return control.value != targetPassword ? {'passwordMismatch': true} : null;
  };
}
@Directive({
  selector: '[appPasswordMatch]',
  standalone: true,
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordMatchDirective, multi: true}]
})
export class PasswordMatchDirective implements Validator {
  @Input('appPasswordMatch') targetPassword!: string;

  validate(control: AbstractControl) {
    return passwordMatcher(this.targetPassword)(control);
  }
}
