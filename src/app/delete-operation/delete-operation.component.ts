import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-delete-operation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-operation.component.html',
  styleUrl: './delete-operation.component.css'
})
export class DeleteOperationComponent {
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
   @Output() confirm: EventEmitter<void> = new EventEmitter<void>();
  count: number = 0;

}
