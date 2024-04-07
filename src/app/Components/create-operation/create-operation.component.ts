import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../services/auth-service";
import {Operation} from "../../interface/operation";
import {CommonModule} from "@angular/common";
import {UserInterface} from "../../interface/user";
import {faSave,faXmark} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-create-operation',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: 'create-operation.component.html',
  styleUrl: './create-operation.component.css',
})

export class CreateOperationComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  allowedRegex = /^\d+(\.\d{0,2})?$/;
  currentUsername: string = this.authService.getCurrentUsername();
  amount: string = '';
  comment: string = '';
  userList: UserInterface[] = [];
  receiverUsername = '';
  count: number = this.comment.length;
  formattedDate: any = this.getDate();

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.loadUserList();
  }

  onSubmit(): void {
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');
    const currentUser = usersData[this.currentUsername];
    const receiverData = usersData[this.receiverUsername];
    if (currentUser && currentUser.currentBalance >= this.amount) {
      currentUser.currentBalance -= +(this.amount);
      currentUser.outgoing += +(this.amount);
      localStorage.setItem('users', JSON.stringify(usersData));
      if (receiverData) {
        receiverData.currentBalance += +(this.amount);
        receiverData.income += +(this.amount);
        localStorage.setItem('users', JSON.stringify(usersData));
        const operation: Operation = {
          id: Date.now(),
          from: currentUser.username,
          to: receiverData.username,
          fromUID: currentUser.uid,
          toUID: receiverData.uid,
          amount: +(this.amount),
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

  updateCharacterCount() {
    this.count = this.comment.length;
  }

  getDate(): string {
    return new Date().toLocaleDateString('ru-RU');
  }

  validateKey(event: KeyboardEvent): void {
    if (event.key.length > 1) {
      return;
    }

    const newAmount = this.amount + event.key;
    if (event.key == '.' && !this.amount) {
      this.amount = '0.';
      event.preventDefault();
    }
    if (!this.allowedRegex.test(newAmount)) {
      event.preventDefault();
    }
  }

  preventDoubleSpace(event: KeyboardEvent): void {
    if (event.key == ' ' && this.comment.endsWith(' ')) {
      event.preventDefault();
    }
  }

  isAmountAvailable(): boolean {
    const amountNumber = parseFloat(this.amount);
    const currentUser = this.userList.find(user => user.username == this.currentUsername);
    if (!currentUser) return false;
    return amountNumber > currentUser.currentBalance;
  }

  protected readonly faXmark = faXmark;
  protected readonly faSave = faSave;
}
