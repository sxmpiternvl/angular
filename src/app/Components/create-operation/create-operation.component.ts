import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../services/auth-service";
import {CommonModule, DatePipe} from "@angular/common";
import {UserInterface} from "../../interface/user";
import {faSave, faXmark} from "@fortawesome/free-solid-svg-icons";
import {DoubleSpaceDirective} from "../../directives/double-space/double-space.directive";
import Decimal from "decimal.js";
import {ValidateKeyDirective} from "../../directives/validate-key/validate-key.directive";
import {UserService} from "../../services/user.service";
import {DateControllerDirective} from "../../directives/date-controller/date-controller.directive";


@Component({
  selector: 'app-create-operation',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    CommonModule,
    DoubleSpaceDirective,
    ValidateKeyDirective,
    DateControllerDirective
  ],
  providers: [DatePipe],
  templateUrl: 'create-operation.component.html',
})
export class CreateOperationComponent implements OnInit {
  operationType = 'outgoing';

  date = new Date().toISOString().substring(0, 10);
  // private _date: Date;
  @Output() close = new EventEmitter<void>();
  userList: UserInterface[] = [];
  currentUsername: string = this.authService.getCurrentUsername();
  amount: string = '';
  comment: string = '';
  receiverUsername = undefined;

  constructor(private authService: AuthService, private userService: UserService) {
    // this._date = new Date();
  }

  // get date(): string {
  //   return this._date.toISOString().substring(0, 10);
  // }
  //
  // set date(value: string) {
  //   const temp = new Date(value);
  //   this.isValidDate = !isNaN(temp.getTime());
  //   if (this.isValidDate) {
  //     this._date = temp;
  //   }
  // }

  ngOnInit(): void {
    this.userList = this.userService.getUsers().filter((user) => user.username != this.currentUsername);
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
    const amountDecimal = new Decimal(this.amount);

    if (this.operationType == 'outgoing' && currentUser) {
      currentUser.currentBalance = new Decimal(currentUser.currentBalance).minus(amountDecimal).toFixed(2);
      currentUser.outgoing = new Decimal(currentUser.outgoing).plus(amountDecimal).toFixed(2);
      let toUser = this.receiverUsername != undefined ? usersData[this.receiverUsername!] : null;
      console.log(this.receiverUsername)
      if (toUser) {
        toUser.currentBalance = new Decimal(toUser.currentBalance).plus(amountDecimal).toFixed(2);
        toUser.income = new Decimal(toUser.income).plus(amountDecimal).toFixed(2);
      }
      this.recordOperation({
        fromUser: currentUser,
        toUser: toUser,
        amount: amountDecimal,
        usersData: usersData
      });
    } else if (this.operationType == 'income' && currentUser) {
      currentUser.currentBalance = new Decimal(currentUser.currentBalance).plus(amountDecimal).toFixed(2);
      currentUser.income = new Decimal(currentUser.income).plus(amountDecimal).toFixed(2);
      this.recordOperation({fromUser: null, toUser: currentUser, amount: amountDecimal, usersData: usersData});
    }
  }

  private recordOperation({fromUser, toUser, amount, usersData}: {
    fromUser: UserInterface | null,
    toUser: UserInterface | null,
    amount: Decimal,
    usersData: UserInterface[]
  }) {
    const operation = {
      id: Date.now(),
      from: fromUser ? fromUser!.username : 'N/A',
      to: toUser ? toUser.username : 'N/A',
      fromUID: fromUser ? fromUser!.uid : 'N/A',
      toUID: toUser ? toUser.uid : 'N/A',
      amount: amount.toFixed(2),
      datetime: this.date,
      comment: this.comment
    };
    const operationsList = JSON.parse(localStorage.getItem('operations') || '[]');
    operationsList.push(operation);
    localStorage.setItem('operations', JSON.stringify(operationsList));
    localStorage.setItem('users', JSON.stringify(usersData));
    this.close.emit();
  }

  closeModal() {
    this.close.emit();
  }


  protected readonly faXmark = faXmark;
  protected readonly faSave = faSave;
  protected readonly console = console;
}
