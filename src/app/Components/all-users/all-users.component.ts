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
  styleUrl: './all-users.component.css'
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
    if (!removeUser) return;  // Проверяем, существует ли пользователь

    const operationsStr = localStorage.getItem('operations');
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');

    if (operationsStr && removeUser) {
      const allOperations: Operation[] = JSON.parse(operationsStr);
      allOperations.forEach(operation => {
        if (operation.from == removeUser.username || operation.to == removeUser.username) {
          const amountDecimal = new Decimal(operation.amount);
          if (operation.from == removeUser.username) {
            const recipient = usersData[operation.to];
            if (recipient) {
              console.log('recip');
              recipient.income = new Decimal(recipient.income).minus(amountDecimal).toString();
              recipient.currentBalance = new Decimal(recipient.balance)
                .plus(recipient.income)
                .minus(recipient.outgoing)
                .toString();
              console.log(recipient.currentBalance);
            }
          }
          if (operation.to == removeUser.username) {
            console.log('send');
            const sender = usersData[operation.from];
            if (sender) {
              sender.outgoing = new Decimal(sender.outgoing).minus(amountDecimal).toString();
              sender.currentBalance = new Decimal(sender.balance)
                .plus(sender.income)
                .minus(sender.outgoing)
                .toString();
              console.log(sender.currentBalance);
            }
          }
        }
      });
      delete usersData[removeUser.username];
      localStorage.setItem('users', JSON.stringify(usersData));
      const updatedOperations = allOperations.filter(operation =>
        operation.from != removeUser.username && operation.to != removeUser.username
      );
      localStorage.setItem('operations', JSON.stringify(updatedOperations));
    }


    this.allUsers = this.allUsers.filter(user => user.username != username);
  }

  protected readonly faPlus = faPlus;
  protected readonly faTrash = faTrash;
  protected readonly faUser = faUser;
}

