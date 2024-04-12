import {Directive, ElementRef, forwardRef, HostListener} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {data} from "autoprefixer";

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
  private onChange = (value: string) => {
  };
  private onTouched = () => {
  };
  private allowedRegex = /^\d*(\.\d{0,11})?$/;
  private prevValue = '';

  constructor(private elementRef: ElementRef) {
  }

  writeValue(value: any): void {
    this.elementRef.nativeElement.value = value ? value : '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent): void {
    console.log();
    const start = this.elementRef.nativeElement.selectionStart;
    const end = this.elementRef.nativeElement.selectionEnd;
    console.log(this.prevValue, this.elementRef.nativeElement.value);
    if(this.elementRef.nativeElement.value.startsWith('.')) {
      this.elementRef.nativeElement.value = '0' + this.elementRef.nativeElement.value
    }
    if (!this.allowedRegex.test(this.elementRef.nativeElement.value)){
      this.elementRef.nativeElement.value=this.prevValue;
      this.elementRef.nativeElement.setSelectionRange(start - 1, end - 1);
    }
      if(this.elementRef.nativeElement.value.split('.').length > 2) {
        this.elementRef.nativeElement.value = this.prevValue;
      }
    this.prevValue = this.elementRef.nativeElement.value;
    this.onChange(this.elementRef.nativeElement.value);
  }

}
