import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDoubleSpace]',
  standalone: true
})
export class DoubleSpaceDirective {
  private prevValue = '';

  @Output() valueChange = new EventEmitter<string>();

  constructor(private elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>) {}

  @HostListener('input')
  onInput(): void {
    const el = this.elementRef.nativeElement;
    const currentValue = el.value;
    const length = currentValue.length;

    if (length > 1 && currentValue[length - 1] == ' ' && currentValue[length - 2] == ' ') {
      el.value = this.prevValue;
    } else {
      this.prevValue = currentValue;
    }
    this.valueChange.emit(el.value);
  }
}
