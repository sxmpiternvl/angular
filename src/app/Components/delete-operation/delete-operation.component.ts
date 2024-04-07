import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'app-delete-operation',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent],
  templateUrl: './delete-operation.component.html',
  styleUrl: './delete-operation.component.css'
})
export class DeleteOperationComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() submit: EventEmitter<void> = new EventEmitter<void>();
  count: number = 0;
  comment: string = '';
  confirmDelete(): void {
    this.submit.emit();
  }
    updateCharacterCount() {
    this.count = this.comment.length;
  }

  protected readonly faXmark = faXmark;
  protected readonly faTrash = faTrash;
}
