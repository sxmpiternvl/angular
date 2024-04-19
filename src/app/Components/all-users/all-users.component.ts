import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {UserService} from "../../services/user.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {AuthService} from "../../services/auth-service";
import {Operation} from "../../interface/operation";
import {RegistrationComponent} from "../registration/registration.component";
import {ModalComponent} from "../../modal/modal.component";
import {UserInterface} from "../../interface/user";
import {faPlus, faTrash, faUser} from "@fortawesome/free-solid-svg-icons";
import Decimal from "decimal.js";


@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent, RegistrationComponent, ModalComponent],
  templateUrl: 'all-users.component.html',
})
export class AllUsersComponent implements OnInit {
  currentUser: UserInterface | null = null;
  allUsers: UserInterface[] = [];
  operations: string | null = '';

  constructor(protected userService: UserService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.allUsers = this.userService.getUsers();
    this.currentUser = this.userService.getUserByUsername(this.authService.getCurrentUsername());
  }

  removeUser(username: string): void {
    const removeUser: UserInterface | null = this.userService.getUserByUsername(username);
    if (!removeUser) return;

    const operationsStr = localStorage.getItem('operations');
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');

    if (operationsStr) {
      const allOperations: Operation[] = JSON.parse(operationsStr);

      const updatedOperations = allOperations.filter(operation => {
        const involvesRemoveUser = operation.from == removeUser.username || operation.to == removeUser.username;
        if (involvesRemoveUser) {
          const amountDecimal = new Decimal(operation.amount);
          if (operation.from == removeUser.username) {
            const recipient = usersData[operation.to];
            if (recipient) {
              recipient.income = new Decimal(recipient.income).minus(amountDecimal).toString();
              recipient.currentBalance = new Decimal(recipient.balance)
                .plus(recipient.income)
                .minus(recipient.outgoing)
                .toString();
            }
          }
          if (operation.to == removeUser.username) {
            const sender = usersData[operation.from];
            if (sender) {
              sender.outgoing = new Decimal(sender.outgoing).minus(amountDecimal).toString();
              sender.currentBalance = new Decimal(sender.balance)
                .plus(sender.income)
                .minus(sender.outgoing)
                .toString();
            }
          }
        }
        return !involvesRemoveUser;
      });
      delete usersData[removeUser.username];
      localStorage.setItem('users', JSON.stringify(usersData));
      localStorage.setItem('operations', JSON.stringify(updatedOperations));
    }

    this.allUsers = this.allUsers.filter(user => user.username != username);
  }

  protected readonly faPlus = faPlus;
  protected readonly faTrash = faTrash;
  protected readonly faUser = faUser;
}

