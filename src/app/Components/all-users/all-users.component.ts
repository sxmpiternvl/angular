import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {UserService} from "../../services/user.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faTrash, faUser} from "@fortawesome/free-solid-svg-icons";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {AuthService} from "../../services/auth-service";
import {Operation} from "../../interface/operation";
import {RegistrationComponent} from "../registration/registration.component";
import {ModalComponent} from "../../modal/modal.component";
import {UserInterface} from "../../interface/user";
@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent, RegistrationComponent, ModalComponent],
  templateUrl: 'all-users.component.html',
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent {
  currentUser: UserInterface | null;
  allUsers: UserInterface[] = [];
  faUser = faUser;
  trash = faTrash;
  plus = faPlus;
  operations: string | null = '';


  constructor(private userService: UserService, private authService: AuthService) {
    this.getUsers();
    this.currentUser = this.userService.getUserByUsername(this.authService.getCurrentUsername());

  }

  getUsers(): void {
    this.allUsers = this.userService.getUsers();
  }

  remove(username: string): void {
    const removeUser: UserInterface | null = this.userService.getUserByUsername(username);
    if (removeUser) {
      this.operations = localStorage.getItem('operations');
      console.log(this.operations);
      const usersData = JSON.parse(localStorage.getItem('users') || '{}');
      if (this.operations) {
        const allOperations: Operation[] = JSON.parse(this.operations);
        allOperations.forEach(operation => {
          if (operation.fromUID == removeUser.uid || operation.toUID == removeUser.uid) {
            if (operation.fromUID == removeUser.uid && usersData[operation.to]) {
              usersData[operation.to].income -= operation.amount;
              usersData[operation.to].currentBalance = usersData[operation.to].balance + usersData[operation.to].income - usersData[operation.to].outgoing;
            } else if (operation.toUID == removeUser.uid && usersData[operation.from]) {
              usersData[operation.from].outgoing -= operation.amount;
              usersData[operation.from].currentBalance = usersData[operation.from].balance + usersData[operation.from].income - usersData[operation.from].outgoing;
            }
          }
        });
        const updatedOperations = allOperations.filter(operation =>
          (operation.fromUID != removeUser.uid) && (operation.toUID != removeUser.uid)
        );
        localStorage.setItem('operations', JSON.stringify(updatedOperations));
      }
      localStorage.setItem('users', JSON.stringify(usersData));
      this.authService.removeUser(username);
      this.allUsers = this.allUsers.filter(user => user.username != username);
    }
  }


}

