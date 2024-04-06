import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible) {
      <div>
        <div class="bg-black fixed top-0 left-0 h-full w-full bg-opacity-40 flex justify-center items-center">
          <div class="bg-white relative rounded-2xl p-[32px] gap-2">
            <ng-container *ngTemplateOutlet="content ?? null"></ng-container>
          </div>
        </div>
      </div>
    }

  `,
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() content?: TemplateRef<any>;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  isVisible: boolean = false;

  open(): void {
    this.isVisible = true;
  }
  close(): void {
    this.isVisible = false;
    this.onClose.emit();
  }
}
