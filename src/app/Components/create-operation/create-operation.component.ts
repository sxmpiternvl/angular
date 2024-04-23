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
import {OperationsService} from "../../services/operations.service";


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
  operationTypes = [
    { label: 'Расход', value: 'outgoing' },
    { label: 'Приход', value: 'income' }
  ];
  operationType = 'outgoing';

  date:Date = new Date();
  // private _date: Date;
  @Output() close = new EventEmitter<void>();
  userList: UserInterface[] = [];
  currentUsername: string = this.authService.getCurrentUsername();
  amount: string = '';
  comment: string = '';
  receiverUsername = undefined;

  constructor(private authService: AuthService, private userService: UserService, private opService:OperationsService) {
    // this._date = new Date();
  }
  //
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

  amountGreaterThanBalance(): boolean {
   return this.opService.amountGreaterThanBalance(this.currentUsername, this.amount);
  }

  onSubmit(): void {
    this.opService.submitOperation(this.operationType, this.amount, this.currentUsername, this.receiverUsername, this.date, this.comment);
    this.close.emit();
  }

  closeModal() {
    this.close.emit();
  }


  protected readonly faXmark = faXmark;
  protected readonly faSave = faSave;
  protected readonly console = console;
}
