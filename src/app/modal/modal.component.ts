import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CreateOperationComponent} from "../create-operation/create-operation.component";
import {CommonModule} from "@angular/common";
import {RegistrationComponent} from "../registration/registration.component";
import {DeleteOperationComponent} from "../delete-operation/delete-operation.component";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CreateOperationComponent, CommonModule, RegistrationComponent, DeleteOperationComponent],
  template: `
    <div *ngIf="show">
      <div>
        <div class="bg-black fixed top-0 left-0 h-full w-full bg-opacity-40 flex justify-center items-center">
          <div class="bg-white relative rounded-2xl p-[32px] gap-2">
            <ng-container *ngTemplateOutlet="modalContent"></ng-container>
          </div>
        </div>
      </div>
    </div>

    <ng-template #modalContent>
      <ng-container *ngIf="modalType == 'createOperation'">
        <app-create-operation (cancel)="closeModal()"></app-create-operation>
      </ng-container>
      <ng-container *ngIf="modalType == 'registration'">
        <app-registration (cancel)="closeModal()"></app-registration>
      </ng-container>
      <ng-container *ngIf="modalType == 'removeOperation'">
        <app-delete-operation (cancel)="closeModal()" (confirm)="confirmDelete()"></app-delete-operation>
      </ng-container>
    </ng-template>
  `,
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() show: boolean = false;
  @Input() modalType: string = '';
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }

  confirmDelete(): void {
    this.confirm.emit();
  }

}
