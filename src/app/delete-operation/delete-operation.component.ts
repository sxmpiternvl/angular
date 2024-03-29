import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-delete-operation',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent],
  templateUrl: './delete-operation.component.html',
  styleUrl: './delete-operation.component.css'
})
export class DeleteOperationComponent {
  xmark = faXmark;
  faTrash=faTrash;
  comment: string = '';
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() submit: EventEmitter<void> = new EventEmitter<void>();
  count: number = 0;

  confirmDelete(): void {
    this.submit.emit();
  }

    updateCharacterCount() {
    this.count = this.comment.length;
  }

}
