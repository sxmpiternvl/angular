import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../auth-service";

import {routeAnimationState} from "../route.animations";
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-create-operation',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    CommonModule
  ],
  template: `
@if(show){
<section class="bg-black absolute top-0 left-0 h-full w-full bg-opacity-40">
    <section class="bg-white absolute top-[15%] left-[37%] h-auto w-[26%] overflow-hidden border-0 rounded-2xl p-4">
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
              <input type="text" [(ngModel)]="this.amount" name="amount" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
            </div>
            <div>
  <p>Комментарий</p>
  <textarea [(ngModel)]="comment" (input)="updateCharacterCount()" name="comment"
            class="h-[120px] w-full top-0 align-text-top border-0 rounded-2xl bg-slate-50 p-1.5" minlength="10"
            maxlength="255"></textarea>
  <p class="text-gray-400 pt-2" [ngClass]="{ 'text-red-500':  count < 10 || count > 255 }">Символов: {{ count }}/10-255</p>
</div>
          </div>
          <div class="grid grid-cols-2">
            <div class="bg-black px-4 py-2 rounded-xl mx-4 ml-10 w-32">
              <fa-icon [icon]="xmark" class="text-white"></fa-icon>
              <button (click)="this.close.emit()" class="text-white pl-1">Отменить</button>
            </div>
            <div class="border p-2 rounded-xl border-blue-700 w-40">
              <button type="submit" class="text-blue-700">
                <fa-icon [icon]="faSave" class="text-blue-700 pl-1"></fa-icon>
                Создать запись
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
</section>
}
  `,
  styleUrl: './create-operation.component.css',
  animations: [routeAnimationState],
})

export class CreateOperationComponent {
  @HostBinding('@routeAnimationTrigger') routeAnimation = true;

  faSave = faSave;
  xmark = faXmark;
  receiver: any = null;
  receiverUsername = '';
  currentUsername: string = this.authService.getCurrentUsername();
  amount: number = 0;
  comment: string = '';
  count: number = this.comment.length;
  operationsList: any[] = [];
  currentDate: any = new Date();
  formattedDate: any = `${this.currentDate.getDate().toString().padStart(2, '0')}.${(this.currentDate.getMonth() + 1).toString().padStart(2, '0')}.${this.currentDate.getFullYear()}`;
  @Input('show')
  show = false;
  @Output('close')
  close = new EventEmitter();

  constructor(private authService: AuthService) {
        this.loadOperations();
  }

onSubmit(): void {
  const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
  const currentUser = usersData[this.currentUsername];
  if (currentUser && currentUser.balance >= this.amount) {
    currentUser.balance -= this.amount;
    let out = parseInt(currentUser.outgoing);
    out+=parseInt(this.amount.toString());
    currentUser.outgoing = out;
    localStorage.setItem('users', JSON.stringify(usersData));
    const receiverData = usersData[this.receiverUsername];
    if (receiverData) {
      let balance = parseInt(receiverData.balance);
      balance += parseInt(this.amount.toString());
      receiverData.income+=parseInt(this.amount.toString());
      receiverData.balance = balance;
      localStorage.setItem('users', JSON.stringify(usersData));
      const operation = {
        from: this.currentUsername,
        to: this.receiverUsername,
        amount: this.amount,
        datetime: this.formattedDate,
      };
      const operationsList = JSON.parse(localStorage.getItem('operations') ?? '[]');
      operationsList.push(operation);
      localStorage.setItem('operations', JSON.stringify(operationsList));
      this.close.emit();
    }
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

  updateCharacterCount() {
    this.count = this.comment.length;
  }

}
