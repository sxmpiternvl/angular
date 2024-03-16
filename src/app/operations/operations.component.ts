import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth-service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {OperationComponent} from "../operation/operation.component";

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form>
      <button mat-raised-button color="primary" (click)="openOperationDialog()">Создать операцию</button>

      <p class="">From:</p>
      <p>{{currentUsername}}</p>
      <p>To:</p>
      <div>
        <input type="text" [(ngModel)]="receiverUsername" name="receiverUsername">
        <button type="button" (click)="getReceiver()">Continue</button>
      </div>
      <div *ngIf="isReceiverValid">
        <p>Amount:</p>
        <input type="text" [(ngModel)]="amount" name="amount">
        <button type="button" (click)="onSubmit()">Send</button>
      </div>
      <div>
        <table>
          <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Date/Time</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let operation of filteredOperationsList; let i = index">
            <td>{{ operation.from }}</td>
            <td>{{ operation.to }}</td>
            <td>{{ operation.amount }}</td>
            <td>{{ operation.datetime }}</td>
            <button mat-raised-button color="warn" (click)="removeOperation(i)">Remove</button>
          </tr>
          </tbody>
        </table>
      </div>
    </form>
  `,
  styleUrl: './operations.component.css'
})
export class OperationsComponent implements OnInit {
  operationsList: any[] = [];
  filteredOperationsList: any[] = [];
  currentUsername: string = '';
  amount: number = 0;
  receiverUsername = '';
  receiver: any = null;
  sender: any = null;
  isReceiverValid: boolean = false;

  constructor(private authService: AuthService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.currentUsername = this.authService.getCurrentUsername();
    this.getSender();
    this.loadOperations();
    this.updateFilteredOperations();
  }

  getSender(): any {
    const item = localStorage.getItem(this.currentUsername);
    if (item !== null) {
      this.sender = JSON.parse(item);
    }
    return this.sender;
  }

  getReceiver(): void {
    const receiverExists = localStorage.getItem(this.receiverUsername);
    if (receiverExists) {
      this.receiver = JSON.parse(receiverExists);
      this.isReceiverValid = true;
    } else {
      this.isReceiverValid = false;
      alert('User not found');
    }
  }

  onSubmit(): void {
    let newUserBalance = 0;
    let newReceiverBalance = 0;
    if (this.isReceiverValid && this.amount > 0) {
      if (parseInt(this.sender.balance) >= this.amount) {
        newUserBalance = parseInt(this.sender.balance) - parseInt((this.amount).toString());
        this.sender.balance = (newUserBalance);
        localStorage.setItem(this.sender.username, JSON.stringify(this.sender));

        const operation = {
          from: this.currentUsername,
          to: this.receiverUsername,
          amount: this.amount,
          datetime: new Date().toLocaleString()
        };
        this.operationsList.push(operation);
        this.updateFilteredOperations();
        localStorage.setItem('operations', JSON.stringify(this.operationsList));

      }
      newReceiverBalance = parseInt(this.receiver.balance) + parseInt((this.amount).toString());
      this.receiver.balance = (newReceiverBalance || 0);
      localStorage.setItem(this.receiver.username, JSON.stringify(this.receiver));
    }
  }

  loadOperations(): void {
    const operationsData = localStorage.getItem('operations');
    if (operationsData) {
      this.operationsList = JSON.parse(operationsData);
    }
  }

  updateFilteredOperations(): void {
    this.filteredOperationsList = this.operationsList.filter(
      operation => operation.from === this.currentUsername || operation.to === this.currentUsername
    );
  }

  removeOperation(index: number): void {
    this.operationsList.splice(index, 1);
    localStorage.setItem('operations', JSON.stringify(this.operationsList));
    location.reload();
  }

  openOperationDialog(): void {
    const dialogRef = this.dialog.open(OperationComponent, {
      width: '390px',
      data: {
        createOperation: (operation: any) => {
          this.onSubmit();
        }
      }
    });
  }
}
