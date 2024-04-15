import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth-service";
import { CommonModule, DatePipe } from "@angular/common";
import { UserInterface } from "../../interface/user";
import { faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { DoubleSpaceDirective } from "../../directives/double-space/double-space.directive";
import Decimal from "decimal.js";
import { ValidateKeyDirective } from "../../directives/validate-key/validate-key.directive";
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-create-operation',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    CommonModule,
    DoubleSpaceDirective,
    ValidateKeyDirective
  ],
  providers: [DatePipe],
  templateUrl: 'create-operation.component.html',
  styleUrl: './create-operation.component.css',
})
export class CreateOperationComponent implements OnInit {
  date: Date;
  @Output() close = new EventEmitter<void>();
  userList: UserInterface[] = [];
  currentUsername: string = this.authService.getCurrentUsername();
  amount: string = '';
  comment: string = '';
  receiverUsername = '';

  constructor(private authService: AuthService, private userService: UserService, private datePipe: DatePipe) {
    this.date = new Date();
  }

  ngOnInit(): void {
    this.userList = this.userService.getUsers(). filter((user) => user.username != this.currentUsername);
  }

  amountExceedsBalance(): boolean {
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');
    const currentUser = usersData[this.currentUsername];
    if (!currentUser || !this.amount)
      return false;
    const balanceDecimal = new Decimal(currentUser.currentBalance);
    const amountDecimal = new Decimal(this.amount);
    return amountDecimal.gt(balanceDecimal);
  }

  onSubmit(): void {
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');
    const currentUser = usersData[this.currentUsername];
    const receiverData = usersData[this.receiverUsername];
    if (!this.amount) {
      return;
    }
    const amountDecimal = new Decimal(this.amount);
    if (currentUser && new Decimal(currentUser.currentBalance).gte(amountDecimal)) {
      currentUser.currentBalance = new Decimal(currentUser.currentBalance).minus(amountDecimal).toFixed(2);
      currentUser.outgoing = new Decimal(currentUser.outgoing).plus(amountDecimal).toFixed(2);
      if (receiverData) {
        receiverData.currentBalance = new Decimal(receiverData.currentBalance).plus(amountDecimal).toFixed(2);
        receiverData.income = new Decimal(receiverData.income).plus(amountDecimal).toFixed(2);
        const operation = {
          id: Date.now(),
          from: currentUser.username,
          to: receiverData.username,
          fromUID: currentUser.uid,
          toUID: receiverData.uid,
          amount: amountDecimal.toFixed(2),
          datetime: this.datePipe.transform(this.date, 'dd.MM.yyyy'),
          comment: this.comment
        };
        const operationsList = JSON.parse(localStorage.getItem('operations') || '[]');
        operationsList.push(operation);
        localStorage.setItem('operations', JSON.stringify(operationsList));
        localStorage.setItem('users', JSON.stringify(usersData));
        this.close.emit();
      }
    }
  }
  closeModal() {
    this.close.emit();
  }
  validComment(){
    return this.comment.length != 0 &&( this.comment.length < 10 || this.comment.length > 255);
  }

  protected readonly faXmark = faXmark;
  protected readonly faSave = faSave;
  protected readonly console = console;
}
