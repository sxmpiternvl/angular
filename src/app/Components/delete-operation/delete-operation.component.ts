import {Component, EventEmitter, Input, Output} from '@angular/core';
import Decimal from "decimal.js";
import {Operation} from "../../interface/operation";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {DoubleSpaceDirective} from "../../directives/double-space/double-space.directive";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
  selector: 'app-delete-operation',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent, DoubleSpaceDirective],
  templateUrl: './delete-operation.component.html',

})
export class DeleteOperationComponent {
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
    console.log(this.operationId);
    const operationsList: Operation[] = JSON.parse(localStorage.getItem('operations') ?? '[]');
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    const operationToRemove = operationsList.find(operation => operation.id == operationId);
    if (operationToRemove) {
      //poluchatel  'N/A'
      if (operationToRemove.toUID == 'N/A') {
        for (let username in usersData) {
          if (usersData[username].uid == operationToRemove.fromUID) {
            const sender = usersData[username];
            sender.currentBalance = new Decimal(sender.currentBalance).plus(operationToRemove.amount).toFixed(2)
            sender.outgoing = new Decimal(sender.outgoing).minus(operationToRemove.amount).toFixed(2);
            localStorage.setItem('users', JSON.stringify(usersData));
            break;
          }
        }
        const filteredOperations = operationsList.filter(operation => operation.id != operationId);
        localStorage.setItem('operations', JSON.stringify(filteredOperations));
        return;
      }
      //otpravitel 'N/A'
      else if(operationToRemove.fromUID == 'N/A'){
        console.log('1');
        for (let username in usersData) {
          console.log('2');
          if (usersData[username].uid == operationToRemove.toUID) {
            console.log('3');
            const receiver = usersData[username];
            receiver.currentBalance = new Decimal(receiver.currentBalance).minus(operationToRemove.amount).toFixed(2);
            receiver.income = new Decimal(receiver.income).minus(operationToRemove.amount).toFixed(2);
            localStorage.setItem('users', JSON.stringify(usersData));
            break;
          }
        }
        const filteredOperations = operationsList.filter(operation => operation.id != operationId);
        localStorage.setItem('operations', JSON.stringify(filteredOperations));
        return;
      }
      //остальные
      let sender, receiver;
      for (let username in usersData) {
        if (usersData[username].uid == operationToRemove.fromUID) {
          sender = usersData[username];
          sender.outgoing = new Decimal(sender.outgoing).minus(operationToRemove.amount).toFixed(2);
          sender.currentBalance = new Decimal(sender.currentBalance).plus(operationToRemove.amount).toFixed(2);
        } else if (usersData[username].uid == operationToRemove.toUID) {
          receiver = usersData[username];
          receiver.income = new Decimal(receiver.income).minus(operationToRemove.amount).toFixed(2);
          receiver.currentBalance = new Decimal(receiver.currentBalance).minus(operationToRemove.amount).toFixed(2);
        }
      }
      localStorage.setItem('users', JSON.stringify(usersData));
      const filteredOperations = operationsList.filter(operation => operation.id != operationId);
      localStorage.setItem('operations', JSON.stringify(filteredOperations));
    }
  }
  protected readonly faXmark = faXmark;
  protected readonly faTrash = faTrash;
}
