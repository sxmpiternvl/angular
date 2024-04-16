import {Directive, ElementRef, forwardRef, HostListener} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

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
  private onChange: (value: Date) => void = () => {
  };
  private onTouched: () => void = () => {
  };

  constructor(private elementRef: ElementRef<HTMLInputElement>) {
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    const date = new Date(value);
    if (date.toString() != 'Invalid Date') {
      this.onChange(date);
    }
  }

  writeValue(value: Date): void {
    this.elementRef.nativeElement.value = value ? this.toDateString(value) : '';
  }

  registerOnChange(fn: (value: Date) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }

  private toDateString(date: Date): string {
    return date.toISOString().substring(0, 10);
  }
}
