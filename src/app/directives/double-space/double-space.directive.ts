import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appDoubleSpace]',
  standalone: true
})
export class DoubleSpaceDirective {
  constructor() {
  }
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (event.key == ' ' && (event.target as HTMLInputElement).value.endsWith(' ')) {
      event.preventDefault();
    }
  }

}
