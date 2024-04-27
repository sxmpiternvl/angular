import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {UserService} from "../../services/user.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {AuthService} from "../../services/auth-service";
import {RegistrationComponent} from "../registration/registration.component";
import {ModalComponent} from "../../modal/modal.component";
import {UserInterface} from "../../interface/user";
import {faPlus, faTrash, faUser} from "@fortawesome/free-solid-svg-icons";
import {OperationsService} from "../../services/operations.service";


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

  constructor(protected userService: UserService, private authService: AuthService, private opService: OperationsService) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.allUsers = this.userService.getUsers();
    this.currentUser = this.userService.getUserByUsername(this.authService.getCurrentUsername());
  }

  removeUser(username: string): void {
    if (username != this.currentUser?.username) {
      this.opService.removeUser(username);
      this.allUsers = this.allUsers.filter(user => user.username != username);
    }
  }

  protected readonly faPlus = faPlus;
  protected readonly faTrash = faTrash;
  protected readonly faUser = faUser;
}

