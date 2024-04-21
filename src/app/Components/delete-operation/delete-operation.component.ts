import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {DoubleSpaceDirective} from "../../directives/double-space/double-space.directive";
import {OperationsService} from "../../services/operations.service";


@Component({
  selector: 'app-delete-operation',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent, DoubleSpaceDirective],
  templateUrl: './delete-operation.component.html',

})
export class DeleteOperationComponent {
  constructor(private opService: OperationsService) { }
  @Input() operationId: number | null = null;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() operationDeleted: EventEmitter<void> = new EventEmitter<void>();
  comment: string = '';

  confirmDelete(): void {
    if (this.operationId) {
      this.removeOperation(this.operationId);
    }
    this.operationDeleted.emit();
    this.close.emit();
  }

  closeModal(){
    this.close.emit();
  }

  private removeOperation(operationId: number): void {
      this.opService.removeOperation(operationId);
  }

  protected readonly faXmark = faXmark;
  protected readonly faTrash = faTrash;
}
