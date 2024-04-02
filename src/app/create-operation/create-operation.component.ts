import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../auth-service";
import {Operation} from "../operation";
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
    <div>
      <form (ngSubmit)="onSubmit()">
        <h1 class="text-2xl pb-1"> Создание записи</h1>
        <div>
          <p class="p-0.5">Даqта</p>
          <div class="bg-slate-50 rounded-2xl px-2 py-2 font-mono my-2">
            {{ this.formattedDate }}
          </div>
          <p>Кому:</p>
          <select [(ngModel)]="receiverUsername" name="receiverUsername"
                  class="bg-slate-50 rounded-2xl px-4 py-2 font-mono my-2 w-full">
            <ng-container *ngFor="let user of userList">
              <ng-container *ngIf="user.username !== currentUsername">
                <option class="bg-slate-50" [value]="user.username">{{ user.username }}</option>
              </ng-container>
            </ng-container>
          </select>
          <div>
            <p>Сумма:</p>
            <input class="remove-arrow" type="text" [(ngModel)]="this.amount" name="amount"
                   (input)="onInput($event)" (ngModelChange)="onChange($event)">
          </div>
          <div>
            <p>Комментарий</p>
            <textarea [(ngModel)]="comment" (input)="updateCharacterCount()" name="comment"
                      class="resize-none h-[120px] w-full align-text-top border-0 rounded-2xl bg-slate-50 p-3 "
                      minlength="10"
                      maxlength="255"></textarea>
            <p class="text-gray-400 pt-2" [ngClass]="{ 'text-red-500': count!=0 && ( count < 10 || count > 255) }">
              Символов: {{ count }}/10-255</p>
          </div>
        </div>
        <div class="grid grid-cols-2 pt-4">
          <button (click)="this.close.emit()" class="custom-btn-neutral">
            <fa-icon [icon]="xmark" class="text-white"></fa-icon>
            <span class="pl-1">Отменить</span>
          </button>
          <button type="submit" id="newOperation"
                  class="border p-2 rounded-xl border-blue-700 w-40 hover:bg-primary duration-300 flex items-center justify-center text-blue-700 hover:text-white">
            <fa-icon [icon]="faSave" class="text-blue-700"></fa-icon>
            <span class="pl-1">Создать запись</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './create-operation.component.css',
})

export class CreateOperationComponent {
  @Output() close = new EventEmitter<void>();
  currentUsername: string = this.authService.getCurrentUsername();
  amount: string = '';
  comment: string = '';
  userList: any[] = [];
  receiverUsername = '';
  count: number = this.comment.length;
  faSave = faSave;
  xmark = faXmark;

  formattedDate: any = this.getDate();

  constructor(private authService: AuthService) {
    this.loadUserList();
  }

  onSubmit(): void {
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');
    const currentUser = usersData[this.currentUsername];
    const receiverData = usersData[this.receiverUsername];
    if (currentUser && currentUser.currentBalance >= this.amount) {
      currentUser.currentBalance -= parseFloat(this.amount);
      currentUser.outgoing += parseFloat(this.amount);
      localStorage.setItem('users', JSON.stringify(usersData));
      if (receiverData) {
        receiverData.currentBalance += parseFloat(this.amount);
        receiverData.income += parseFloat(this.amount);
        localStorage.setItem('users', JSON.stringify(usersData));
        const operation: Operation = {
          id: Date.now(),
          from: currentUser.username,
          to: receiverData.username,
          fromUID: currentUser.uid,
          toUID: receiverData.uid,
          amount: parseFloat(this.amount),
          datetime: this.getDate(),
          comment: this.comment
        };
        const operationsList: Operation[] = JSON.parse(localStorage.getItem('operations') || '[]');
        operationsList.push(operation);
        localStorage.setItem('operations', JSON.stringify(operationsList));
        this.close.emit();
      }
    }
  }

  loadUserList(): void {
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');
    this.userList = [];
    for (const key in usersData) {
      this.userList.push(usersData[key]);
    }
  }

  onInput(event: any): void {
    const inputElement = event.target;
    let inputValue = inputElement.value;
    if (inputValue.startsWith('.')) {
      inputValue = '0' + inputValue;
    }
    inputValue = inputValue.replace(/[^0-9.]/g, '');
    event.target.value = inputValue;
    this.amount = inputValue;
  }

  onChange(event: any) {

  }

  updateCharacterCount() {
    this.count = this.comment.length;
  }

  getDate(): string {
    return new Date().toLocaleDateString('ru-RU');
  }

  protected readonly onchange = onchange;
}
