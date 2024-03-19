import {Component, Inject, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {data} from "autoprefixer";

@Component({
  selector: 'app-create-operation',
  standalone: true,
  imports: [
    FaIconComponent,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    FormsModule
  ],
  template: `
    <div class="border-2 pt-6 pb-6 rounded-2xl border-black  overflow-hidden ">
      <form (ngSubmit)="onSubmit()">
        <h1 mat-dialog-title> Создание записи</h1>
        <div mat-dialog-content>
          <p>Дата</p>
          <div class="bg-gray-100 rounded-2xl px-2 py-2 font-mono my-2">
            {{this.formattedDate}}
          </div>
          <p>To:</p>
          <div>
            <input (input)="getReceiver()" type="text" [(ngModel)]="this.receiverUsername" name="receiverUsername">
          </div>
          <div>
            <p>Amount:</p>
            <input type="text" [(ngModel)]="this.amount" name="amount">
          </div>
          <div>
            <p>Комментарий</p>
            <input type="text" [(ngModel)]="this.comment" name="comment" class="h-20">
            <p class="text-gray-400 pt2">Символов: 0/10-255</p>
          </div>

        </div>
        <div mat-dialog-actions>
          <div class="bg-black px-4 py-2 rounded-xl mx-4 ml-10" >
               <fa-icon [icon]="xmark" class="text-white"></fa-icon>
          <button (click)="closepopup()" class="text-white">Отменить</button>

          </div>
             <div class="border p-2 rounded-xl border-blue-700" >
                <button  type="submit" class="text-blue-700">
            <fa-icon [icon]="faSave" class="text-blue-700"></fa-icon>
            Создать запись
          </button>
             </div>

        </div>
      </form>
    </div>
  `,
  styleUrl: './create-operation.component.css'
})


export class CreateOperationComponent implements OnInit {
  faSave = faSave;
  xmark = faXmark;
  sender: any = null;
  receiver: any = null;
  receiverUsername = '';
  currentUsername: string = '';
  amount: number = 0;
  comment: string = '';
  operationsList: any[] = [];
  currentDate: any = new Date();
  formattedDate: any = `${this.currentDate.getDate().toString().padStart(2, '0')}:${(this.currentDate.getMonth() + 1).toString().padStart(2, '0')}:${this.currentDate.getFullYear()}`;

  constructor(private ref: MatDialogRef<CreateOperationComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.currentUsername = this.data.currentUsername;
    this.getSender();
    this.loadOperations();
  }

  closepopup() {
    this.ref.close();
  }

  onSubmit(): void {
    let newUserBalance = 0;
    let newReceiverBalance = 0;
    if (this.amount > 0) {
      if (parseInt(this.sender.balance) >= this.amount) {
        newUserBalance = parseInt(this.sender.balance) - parseInt((this.amount).toString());
        this.sender.balance = (newUserBalance);
        localStorage.setItem(this.sender.username, JSON.stringify(this.sender));

        const operation = {
          from: this.currentUsername,
          to: this.receiverUsername,
          amount: this.amount,
          datetime: this.formattedDate,
        };
        this.operationsList.push(operation);

        localStorage.setItem('operations', JSON.stringify(this.operationsList));

      }
      newReceiverBalance = parseInt(this.receiver.balance) + parseInt((this.amount).toString());
      this.receiver.balance = (newReceiverBalance);
      localStorage.setItem(this.receiver.username, JSON.stringify(this.receiver));
      this.closepopup();
    }
  }


  getSender(): any {
    const item = localStorage.getItem(this.currentUsername);
    if (item !== null) {
      this.sender = JSON.parse(item);
    }
    return this.sender;
  }

  getReceiver(): any {
    const receiverExists = localStorage.getItem(this.receiverUsername);
    if (receiverExists) {
      this.receiver = JSON.parse(receiverExists);
    }
  }


  loadOperations(): void {
    const operationsData = localStorage.getItem('operations');
    if (operationsData) {
      this.operationsList = JSON.parse(operationsData);
    }
  }
}
