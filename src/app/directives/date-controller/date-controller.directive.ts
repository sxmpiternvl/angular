import { Directive, ElementRef, Renderer2, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appDateController]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateControllerDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateControllerDirective),
      multi: true
    }
  ]
})
export class DateControllerDirective implements ControlValueAccessor, Validator {
  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2,
              ) {
  }
  writeValue(value: Date): void {
    const dateStr = value ? value.toISOString().substring(0, 10) : '';
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', dateStr);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  @HostListener('change', ['$event.target.valueAsDate'])
  onChangeEvent(value: Date | null): void {
    this.onChange(value);
  }
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isValid = value && !isNaN(value.getTime());
    return isValid ? null : { invalidDate: true };
  }
}
