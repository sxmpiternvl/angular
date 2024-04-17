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
    const userToRemove: UserInterface | null = this.userService.getUserByUsername(username);
    if (!userToRemove) return;

    const operations = JSON.parse(localStorage.getItem('operations') || '[]');
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');
    const updatedOperations: Operation[] = [];

    operations.forEach((operation:Operation) => {
      const isFromUser = operation.fromUID == userToRemove.uid;
      const isToUser = operation.toUID == userToRemove.uid;

      if (isFromUser || isToUser) {
        if (isFromUser && usersData[operation.toUID]) {
          const receiver = usersData[operation.toUID];
          receiver.income -= operation.amount;
          receiver.currentBalance = receiver.balance + receiver.income - receiver.outgoing;
        }
        if (isToUser && usersData[operation.fromUID]) {
          const sender = usersData[operation.fromUID];
          sender.outgoing -= operation.amount;
          sender.currentBalance = sender.balance + sender.income - sender.outgoing;
        }
      } else {
        updatedOperations.push(operation);
      }
    });

    delete usersData[userToRemove.username];
    localStorage.setItem('operations', JSON.stringify(updatedOperations));
    localStorage.setItem('users', JSON.stringify(usersData));

    this.allUsers = this.allUsers.filter(user => user.username !== username);
  }

  protected readonly faPlus = faPlus;
  protected readonly faTrash = faTrash;
  protected readonly faUser = faUser;
}

