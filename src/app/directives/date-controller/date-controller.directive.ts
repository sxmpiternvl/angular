import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

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
  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};
  private _date: string | null = null;
  isValidDate: boolean = true;

  constructor(private elementRef: ElementRef<HTMLInputElement>, private renderer: Renderer2) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value;

    // Проверяем, если значение состоит только из 0
    if (inputValue.replace(/0/g, '').length === 0) {
      inputValue = '';
    }

    const formattedValue = this.formatInputValue(inputValue);
    inputElement.value = formattedValue;

    if (!formattedValue) {
      this._date = null;
      this.isValidDate = false;
      this.onChange(null);
    } else {
      this._date = formattedValue;
      this.isValidDate = this.isDateValid(formattedValue);
      this.onChange(this._date);
    }
    this.updateInvalidClass();
  }

  writeValue(value: string | null): void {
    this._date = value;
    if (value) {
      this.elementRef.nativeElement.value = value;
      this.isValidDate = this.isDateValid(value);
    } else {
      this.elementRef.nativeElement.value = '';
      this.isValidDate = false;
    }
    this.updateInvalidClass();
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private formatInputValue(value: string): string {
    value = value.replace(/\D/g, '');
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    if (value.length > 4) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }
    if (value.length > 6) {
      value = value.slice(0, 7) + '-' + value.slice(7);
    }
    return value;
  }

  private isDateValid(value: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(value);
  }

  private updateInvalidClass(): void {
    if (this.isValidDate) {
      this.renderer.removeClass(this.elementRef.nativeElement, 'invalid-input');
    } else {
      this.renderer.addClass(this.elementRef.nativeElement, 'invalid-input');
    }
  }
}
