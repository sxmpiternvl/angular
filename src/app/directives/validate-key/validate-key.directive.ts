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
        this.elementRef.nativeElement.value = value ? value : '';
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
        if (event.key == '.' && currentValue.length) {
          newValue = '0.';
          this.elementRef.nativeElement.value = newValue;
          this.onChange(newValue);
          event.preventDefault();
        }
        else if(event.key == '.' && currentValue.startsWith('.')) {
          newValue='0'+currentValue;
          this.elementRef.nativeElement.value = newValue;
          this.onChange(newValue);
          console.log(newValue, 'new')
        }
        if (!this.allowedRegex.test(newValue)) {
          event.preventDefault();
        } else {
          console.log(newValue)
          this.onChange(newValue);
        }
      }

    }
