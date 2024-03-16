import {Component} from '@angular/core';

import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {OperationsComponent} from "../operations/operations.component";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-operation',
  standalone: true,
  imports: [
    MatFormField,
    MatFormFieldModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogContent,
    CommonModule,
    FormsModule,
    MatInputModule,
  ],
  template: `
    <div class="container mx-auto">
<h2 mat-dialog-title class="text-2xl font-bold400 mb-4"> Создание записи</h2>
<mat-dialog-content>
  <div class="flex flex-col space-y-2">
    <div class="flex flex-col">
    <p>Дата</p>
    <mat-form-field>
      <input matInput placeholder="From" [(ngModel)]="from" name="from" class="text-3xl">
    </mat-form-field>
      </div>
    <div>
      <p>Сумма</p>
    <mat-form-field class="w-full">
      <input matInput type="text" placeholder="Amount" [(ngModel)]="amount" name="amount" class="input-field bg-transparent">
    </mat-form-field>
      </div>
    <div>
      <p>Кому</p>
         <mat-form-field class="w-full">
      <input matInput placeholder="To" [(ngModel)]="to" name="to" class="input-field bg-transparent">
    </mat-form-field>
    </div>
  </div>
</mat-dialog-content>
<mat-dialog-actions class="justify-end mt-6">

  <div class="flex" >
  <button mat-button mat-dialog-close class="space-x-40 text-gray-600 ml-4" (click)="this.dialogRef.close(operation)">
    Cancel
  </button>
    <button mat-button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded space-x-40" (click)="createOperation()">
    Create
  </button>
    </div>
</mat-dialog-actions>

      </div>
  `,
  styleUrl: './operation.component.css'
})
export class OperationComponent {
  from: string = '';
  to: string = '';
  amount: number = 0;
  data: any;
  operation: any;

  constructor(public dialogRef: MatDialogRef<OperationsComponent>) {
  }

  createOperation(): void {
    if (this.from && this.to && this.amount) {
      const operation = {
        from: this.from,
        to: this.to,
        amount: this.amount,
        send: true
      };
      console.log(operation);
      this.createOperation();
      this.dialogRef.close(operation);
    } else {
      console.error('Поля не заполнены');
    }
  }
}
