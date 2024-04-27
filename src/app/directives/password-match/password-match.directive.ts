import { Directive, Input } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

@Directive({
  selector: '[appPasswordMatch]',
  standalone: true,
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordMatchValidatorDirective, multi: true}]
})
export class PasswordMatchValidatorDirective implements Validator {
  @Input('appPasswordMatch') passwordControlName!: string;

  validate(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password != confirmPassword) {
      formGroup.setErrors({ 'passwordMismatch': 'Пароли не совпадают' });
      return { 'passwordMismatch': 'Пароли не совпадают' };
    } else {
      formGroup.setErrors(null);
      return null;
    }
  }
}
