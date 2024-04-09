import { Directive, ElementRef, forwardRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
@Directive({
  selector: '[appValidateKey]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ValidateKeyDirective),
      multi: true
    }
  ]
})
export class ValidateKeyDirective implements ControlValueAccessor {
  private onChange = (value: string) => {};
  private onTouched = () => {};
  private allowedRegex = /^\d+(\.\d{0,2})?$/;

  constructor(private elementRef: ElementRef) {}

  writeValue(value: any): void {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key.length > 1) {
      return;
    }
    const currentValue: string = this.elementRef.nativeElement.value;
    let newValue = currentValue + event.key;
    if (event.key == '.' && !currentValue) {
      newValue = '0.';
      event.preventDefault();
    }
    if (!this.allowedRegex.test(newValue)) {
      event.preventDefault();
    } else {
      this.onChange(newValue);
    }
  }

}
