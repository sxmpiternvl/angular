import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../auth-service";
import {comment} from "postcss";


@Component({
  selector: 'app-create-operation',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule
  ],
  template: `

    <section class="bg-white absolute top-[20%] left-[37%] h-auto w-[26%] overflow-hidden border-0 rounded-2xl p-4">
      <div>
        <form (ngSubmit)="onSubmit()">
          <h1 class="text-2xl pb-1"> Создание записи</h1>
          <div>
            <p class="p-0.5">Дата</p>
            <div class="bg-slate-50 rounded-2xl px-2 py-2 font-mono my-2">
              {{this.formattedDate}}
            </div>
            <p>Кому:</p>
            <div>
              <input (input)="getReceiver()" type="text" [(ngModel)]="this.receiverUsername" name="receiverUsername">
            </div>
            <div>
              <p>Сумма:</p>
              <input type="text" [(ngModel)]="this.amount" name="amount">
            </div>
            <div>
              <p>Комментарий</p>
              <textarea [(ngModel)]="this.comment" (input)="this.count = comment.length" name="comment"
                        class="h-[120px] w-full top-0 align-text-top border-0 rounded-2xl bg-slate-50 p-1.5"></textarea>
              <p class="text-gray-400 pt-2">Символов: {{ this.count }}/10-255</p>
            </div>

          </div>
          <div class="grid grid-cols-2">
            <div class="bg-black px-4 py-2 rounded-xl mx-4 ml-10 w-32">
              <fa-icon [icon]="xmark" class="text-white"></fa-icon>
              <button (click)="this.close.emit()" class="text-white">Отменить</button>
            </div>
            <div class="border p-2 rounded-xl border-blue-700 w-40">
              <button type="submit" class="text-blue-700">
                <fa-icon [icon]="faSave" class="text-blue-700"></fa-icon>
                Создать запись
              </button>
            </div>

          </div>
        </form>
      </div>
    </section>


  `,
  styleUrl: './create-operation.component.css'
})


export class CreateOperationComponent implements OnInit {

  faSave = faSave;
  xmark = faXmark;
  sender: any = null;
  receiver: any = null;
  receiverUsername = '';
  currentUsername: string = this.authService.getCurrentUsername();
  amount: number = 0;
  comment: string = '';
  count: number = this.comment.length;
  operationsList: any[] = [];
  currentDate: any = new Date();
  formattedDate: any = `${this.currentDate.getDate().toString().padStart(2, '0')}:${(this.currentDate.getMonth() + 1).toString().padStart(2, '0')}:${this.currentDate.getFullYear()}`;
  @Input('show')
  show = false;
  @Output('close')
  close = new EventEmitter();

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.loadOperations();
  }


  onSubmit(): void {
    const item = localStorage.getItem(this.currentUsername);
    if (item !== null) {
      this.sender = JSON.parse(item);
    }
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
      this.close.emit();
    }
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
