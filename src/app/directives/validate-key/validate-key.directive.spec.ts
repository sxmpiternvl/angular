import { ValidateKeyDirective } from './validate-key.directive';
import { ElementRef } from '@angular/core';

describe('ValidateKeyDirective', () => {
  it('should create an instance', () => {
    const elementRef: ElementRef = {
      nativeElement: document.createElement('input')
    };
    const directive = new ValidateKeyDirective(elementRef);
    expect(directive).toBeTruthy();
  });
});
