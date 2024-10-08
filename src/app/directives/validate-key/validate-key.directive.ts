import {Directive, ElementRef, forwardRef, HostListener} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';


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
  private allowedRegex = /^\d*(\.\d{0,20})?$/;
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
  onInput(event: InputEvent): void {
    let el = this.elementRef.nativeElement;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (event.data == ',') {
      el.value = el.value.replace(',', '.');
      el.setSelectionRange(start,end);
    }
    if(el.value.startsWith('.')) {
      el.value = '0' + el.value;
      el.setSelectionRange(start+1, end+1);
    }
    if (!this.allowedRegex.test(el.value)){
      el.value=this.prevValue;
      el.setSelectionRange(start - 1, end - 1);
    }
    this.prevValue = el.value;
    this.onChange(el.value);
  }

}
