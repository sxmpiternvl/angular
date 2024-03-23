import {Component} from '@angular/core';
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
    <div class=" h-[calc(100vh-45px)]">
      <div class="bg-white h-[80%] overflow-y-scroll rounded-2xl">
        <p class="pb-4 fixed sticky top-0 bg-white pt-3 overflow-hidden text-2xl px-4">Балансы пользователей</p>
        @if(!isLoggedIn()){
        <div *ngFor="let user of allUsers">
          <p class="px-4 text-2xl font-light"> {{ user.username }}</p>
          <div class="grid grid-cols-3 border-b p-4 mb-2.5">
            <div class="flex gap-2 flex-row items-center">
              <div class="rounded-xl bg-green-500 px-2 py-2 w-12 text-2xl text-center">
                <fa-icon [icon]="faTrendUp"></fa-icon>
              </div>
              <div class=""><p>Всего приход</p>
                <p>{{user.income}}</p>
              </div>
            </div>
            <div class="flex gap-2 flex-row items-center">
              <div class="rounded-xl bg-red-500 px-2 py-2 w-12 text-2xl text-center">
                <fa-icon [icon]="faTrendDown"></fa-icon>
              </div>
              <div class=""><p>Всего расход</p>
                <p>{{user.outgoing}}</p>
              </div>
            </div>
            <div class="flex gap-2 flex-row items-center">
              <div class="rounded-xl bg-blue-500 px-2 py-2 w-12 text-2xl text-center">
                <fa-icon [icon]="faPiggy"></fa-icon>
              </div>
              <div class=""><p>Баланс</p>
                <p>
                  Balance: {{  user.balance  }}</p>
              </div>
            </div>
          </div>
        </div>
        }
        @else{
        <div *ngFor="let user of allUsers">
          @if(user.username==this.currentUsername){
        <p class="px-4 text-2xl font-light"> {{user.username}}</p>
        <div class="grid grid-cols-3 border-b p-4 mb-2.5">
          <div class="flex gap-2 flex-row items-center">
            <div class="rounded-xl bg-green-500 px-2 py-2 w-12 text-2xl text-center">
              <fa-icon [icon]="faTrendUp"></fa-icon>
            </div>
            <div class=""><p>{{user.income}}</p>
              <p>111</p>
            </div>
          </div>
          <div class="flex gap-2 flex-row items-center">
            <div class="rounded-xl bg-red-500 px-2 py-2 w-12 text-2xl text-center">
              <fa-icon [icon]="faTrendDown"></fa-icon>
            </div>
            <div class=""><p>{{user.outgoing}}</p>
              <p>111</p>
            </div>
          </div>
          <div class="flex gap-2 flex-row items-center">
            <div class="rounded-xl bg-blue-500 px-2 py-2 w-12 text-2xl text-center">
              <fa-icon [icon]="faPiggy"></fa-icon>
            </div>
            <div class=""><p>{{user.balance}}</p>
              <p>
                Balance:111</p>
            </div>
          </div>
        </div>
        }
     </div>
        }
      </div>

      <div class="bg-white  mt-4 rounded-2xl">
        <p class=" py-2 px-4 text-2xl">Итог</p>
        <div class="px-4   grid grid-cols-3">
          <div class="flex gap-2 flex-row items-center pb-2">
            <div class="rounded-xl bg-green-500 px-2 py-2 w-12 text-2xl text-center">
              <fa-icon [icon]="faTrendUp"></fa-icon>
            </div>
            <div class=""><p>Всего приход</p>
              <p>{{ getTotalIncome() }}</p>
            </div>
          </div>
          <div class="flex gap-2 flex-row items-center">
            <div class="rounded-xl bg-red-500 px-2 py-2 w-12 text-2xl text-center">
              <fa-icon [icon]="faTrendDown"></fa-icon>
            </div>
            <div class=""><p>Всего расход</p>
              <p>{{ getTotalOutgoing() }}</p>
            </div>
          </div>
          <div class="flex gap-2 flex-row items-center">
            <div class="rounded-xl bg-blue-500 px-2 py-2 w-12 text-2xl text-center">
              <fa-icon [icon]="faPiggy"></fa-icon>
            </div>
            <div class=""><p>Баланс</p>
              <p>{{ getTotalBalance() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  `,
  styleUrl: './balances.component.css'
})
export class BalancesComponent {
  faTrendUp = faArrowTrendUp;
  faTrendDown = faArrowTrendDown;
  faPiggy = faPiggyBank;
  allUsers: { username: string, balance: number; income: number; outgoing: number }[] = [];
  operations: any;


  constructor(private userService: UserService, private authService: AuthService) {
    this.getUsers();
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
    let totalOutgoing = 0;
    this.allUsers.forEach(user => {
      totalOutgoing += user.outgoing;
    });
    return totalOutgoing;
  }

  getTotalBalance(): number {
    let totalBalance = 0;
    this.allUsers.forEach(user => {
      totalBalance += user.balance;
    });
    return totalBalance;
  }


}

