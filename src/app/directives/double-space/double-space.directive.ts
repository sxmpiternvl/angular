import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDoubleSpace]',
  standalone: true
})
export class DoubleSpaceDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    const modifiedValue = value.replace(/\s\s+/g, ' ');
    if (value != modifiedValue) {
      this.ngControl.control?.setValue(modifiedValue, { emitEvent: false });
      this.ngControl.control?.updateValueAndValidity();
    }
  }
}
