// import {Directive, forwardRef, Input} from '@angular/core';
// import {AbstractControl, NG_VALIDATORS, NgModel, ValidationErrors, Validator} from "@angular/forms";
//
// export function passwordMatcher(confirmPasswordControl: AbstractControl, passwordControlValue: string): ValidationErrors | null {
//   if (!confirmPasswordControl.value) return null;
//   return confirmPasswordControl.value === passwordControlValue ? null : { 'passwordMismatch': true };
// }
// @Directive({
//   selector: '[appPasswordMatch]',
//   providers: [
//     {
//       provide: NG_VALIDATORS,
//       useExisting: forwardRef(() => PasswordMatchDirective),
//       multi: true
//     }
//   ],
//   standalone: true
// })
// export class PasswordMatchDirective implements Validator{
//   @Input('appPasswordMatch') passwordModel: NgModel;
//
//   validate(control: AbstractControl): ValidationErrors | null {
//     return this.passwordModel ? passwordMatcher(control, this.passwordModel.value) : null;
//   }
// }
