import {Directive, ElementRef, Renderer2, HostListener, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl} from '@angular/forms';

@Directive({
  selector: '[appDateController]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateControllerDirective),
      multi: true
    }
  ]
})
export class DateControllerDirective implements ControlValueAccessor {
  private ngControl!: NgControl | null;

  @HostListener('input', ['$event.target.valueAsDate']) onChange = (value: any) => {
  };
  @HostListener('blur') onTouched = () => {
  };

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  writeValue(value: string): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    this.updateValidity(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = (value) => {
      this.updateValidity(value);
      fn(value);
    };
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private updateValidity(value: string): void {
    const date = new Date(value);
    const isValid = !isNaN(date.getTime());
    if (this.ngControl) {
      this.ngControl.control?.setErrors(isValid ? null : {invalidDate: true});
    }
  }
}
