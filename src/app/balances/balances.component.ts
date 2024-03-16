import {Component, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {CommonModule} from "@angular/common";
import {AuthService} from "../auth-service";
import {FormsModule} from "@angular/forms";

interface Operation {
  from: string;
  to: string;
  amount: number;
  datetime: string;
}

@Component({
  selector: 'app-balances',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <style>
      .remove {
        color: red;
      }
    </style>
    <p>Balances</p>
    <p *ngFor="let user of usersBalances">
      Username: {{ user.username }},
      Balance: {{ !isLoggedIn() ? user.balance : currentUser === user.username ? user.balance : '***' }}
    </p>
    <div *ngIf="!isLoggedIn()">
      <p  class="remove">Remove user</p>
      <input class="remove" type="text" [(ngModel)]="removeUser" name="removeUser">
      <button type="submit" (click)="remove()">Delete User</button>
    </div>

  `,
  styleUrl: './balances.component.css'
})
export class BalancesComponent implements OnInit {
  removeUser = '';
  currentUser: string = this.authService.getCurrentUsername();
  usersBalances: { username: string, balance: number }[] = [];
  operations: any;

  constructor(private userService: UserService, private authService: AuthService) {
  }

  remove(): void {
    const removeUsername = localStorage.getItem(this.removeUser);

    if (removeUsername) {
      this.operations = localStorage.getItem('operations');
      if (this.operations) {
        const allOperations: Operation[] = JSON.parse(this.operations);
        const updatedOperations = allOperations.filter((operation: Operation) =>
          (operation.from !== this.removeUser) && (operation.to !== this.removeUser)
        );
        localStorage.setItem('operations', JSON.stringify(updatedOperations));
      }
      localStorage.removeItem(this.removeUser);
      location.reload();
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  getUsers(): void {
    this.usersBalances = this.userService.getAllUsers();
  }

  ngOnInit(): void {
    this.getUsers();
    console.log(this.usersBalances);
    console.log(this.authService.getCurrentUsername());
  }

}

