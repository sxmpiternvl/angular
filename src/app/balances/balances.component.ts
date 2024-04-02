import {Component, HostBinding} from '@angular/core';
import {UserService} from "../user.service";
import {CommonModule} from "@angular/common";
import {AuthService} from "../auth-service";
import {FormsModule} from "@angular/forms";
import {faArrowTrendUp} from "@fortawesome/free-solid-svg-icons";
import {faArrowTrendDown} from "@fortawesome/free-solid-svg-icons";
import {faPiggyBank} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";



@Component({
  selector: 'app-balances',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent],

  template: `
    <div class="absolute inset-0 flex flex-col p-3 pb-10">
      <div class="bg-white flex-1 overflow-y-scroll rounded-2xl">
        <p class="fixed sticky top-0 bg-white  overflow-hidden mb-2 text-4xl p-4">Балансы пользователей</p>
        @if (!isLoggedIn()) {
          <div *ngFor="let user of allUsers" class="">
            <p class="px-4 text-2xl font-light"> {{ user.username }}</p>
            <div class="grid grid-cols-3 border-b p-4 mb-2.5">
              <div class="flex gap-2 flex-row items-center">
                <div class="rounded-xl bg-success px-2 py-2 w-12 text-2xl text-center">
                  <fa-icon [icon]="faTrendUp"></fa-icon>
                </div>
                <div class=""><p>Всего приход</p>
                  <p>{{ user.income }}</p>
                </div>
              </div>
              <div class="flex gap-2 flex-row items-center">
                <div class="rounded-xl bg-error px-2 py-2 w-12 text-2xl text-center">
                  <fa-icon [icon]="faTrendDown"></fa-icon>
                </div>
                <div class=""><p>Всего расход</p>
                  <p>{{ user.outgoing }}</p>
                </div>
              </div>
              <div class="flex gap-2 flex-row items-center">
                <div class="rounded-xl bg-primary px-2 py-2 w-12 text-2xl text-center">
                  <fa-icon [icon]="faPiggy"></fa-icon>
                </div>
                <div class=""><p>Баланс</p>
                  <p>
                    Balance: {{getBalanceCurrent(user)}}</p>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="grid grid-cols-3 border-b p-4 mb-2.5">
            <div class="flex gap-2 flex-row items-center">
              <div class="rounded-xl bg-success px-2 py-2 w-12 text-2xl text-center">
                <fa-icon [icon]="faTrendUp"></fa-icon>
              </div>
              <div class=""><p>Всего приход</p>
                <p>{{ currentUser.income }}</p>
              </div>
            </div>
            <div class="flex gap-2 flex-row items-center">
              <div class="rounded-xl bg-error px-2 py-2 w-12 text-2xl text-center">
                <fa-icon [icon]="faTrendDown"></fa-icon>
              </div>
              <div class=""><p>Всего расход</p>
                <p>{{ currentUser.outgoing }}</p>
              </div>
            </div>
            <div class="flex gap-2 flex-row items-center">
              <div class="rounded-xl bg-primary px-2 py-2 w-12 text-2xl text-center">
                <fa-icon [icon]="faPiggy"></fa-icon>
              </div>
              <div class=""><p>Баланс</p>
                <p>
                  {{getBalanceCurrent(currentUser)}}</p>
              </div>
            </div>
          </div>
        }
      </div>

      <div class="bg-white  mt-4 rounded-2xl">
        <p class=" pt-4 pb-2 px-4 text-2xl">Итог</p>
        <div class="px-4  grid grid-cols-3 pb-4">
          <div class="flex gap-2 flex-row items-center ">
            <div class="rounded-xl bg-success px-2 py-2 w-12 text-2xl text-center">
              <fa-icon [icon]="faTrendUp"></fa-icon>
            </div>
            <div class=""><p>Всего приход </p>
              @if (!isLoggedIn()) {
                <p>{{ getTotalIncome() }}</p>
              } @else {
                <p>{{ currentUser.income }}</p>
              }
            </div>
          </div>
          <div class="flex gap-2 flex-row items-center">
            <div class="rounded-xl bg-error px-2 py-2 w-12 text-2xl text-center">
              <fa-icon [icon]="faTrendDown"></fa-icon>
            </div>
            <div class=""><p>Всего расход</p>
              @if (!isLoggedIn()) {
                <p>{{getTotalOutgoing()}}</p>
              } @else {
                <p>{{currentUser.outgoing}}</p>
              }
            </div>
          </div>
          <div class="flex gap-2 flex-row items-center">
            <div class="rounded-xl bg-primary px-2 py-2 w-12 text-2xl text-center">
              <fa-icon [icon]="faPiggy"></fa-icon>
            </div>
            <div class=""><p>Баланс</p>
              @if (!isLoggedIn()) {
                <p>{{ getTotalBalance() }}</p>
              } @else {
                <p>{{currentUser.currentBalance}}</p>
              }
            </div>
          </div>
        </div>
      </div>
    </div>

  `,
  styleUrl: './balances.component.css',

})
export class BalancesComponent {

  currentUser: any;
  faTrendUp = faArrowTrendUp;
  faTrendDown = faArrowTrendDown;
  faPiggy = faPiggyBank;
  allUsers: { username: string, balance: number; income: number; outgoing: number, currentBalance: number }[] = [];
  operations: any;
  balanceCurrent: number = 0;

  constructor(private userService: UserService, private authService: AuthService) {
    this.getUsers();
    this.currentUser = this.userService.getUserByUsername(this.authService.getCurrentUsername());
  }


  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  getUsers(): void {
    this.allUsers = this.userService.getUsers();
  }

  getTotalIncome(): number {
    let totalIncome = 0;
    for (const user of this.allUsers) {
      totalIncome += user.income;
    }
    return totalIncome;
  }

  getTotalOutgoing(): number {
    console.log(this.allUsers);
    let totalOutgoing = 0;
    this.allUsers.forEach(user => {
      totalOutgoing += user.outgoing;
    });
    return totalOutgoing;
  }

  getTotalBalance(): number {
    let totalBalance = 0;
    this.allUsers.forEach(user => {
      totalBalance += this.userService.getCurrentBalance(user.balance, user.income,user.outgoing);
    });
    return totalBalance;
  }

  getBalanceCurrent(user: any): number {
    return this.userService.getCurrentBalance(user.balance, user.income,user.outgoing);
  }

}

