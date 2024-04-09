import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {CommonModule} from "@angular/common";
import {AuthService} from "../../services/auth-service";
import {FormsModule} from "@angular/forms";
import {faArrowTrendUp} from "@fortawesome/free-solid-svg-icons";
import {faArrowTrendDown} from "@fortawesome/free-solid-svg-icons";
import {faPiggyBank} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {UserInterface} from "../../interface/user";
import Decimal from "decimal.js";

@Component({
  selector: 'app-balances',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent],
  templateUrl: 'balances.component.html',
  styleUrl: './balances.component.css',

})
export class BalancesComponent implements OnInit {
  currentUser: UserInterface | null = null;
  allUsers: UserInterface[] = [];

  constructor(private userService: UserService, private authService: AuthService) {
  }

  ngOnInit() {
    this.allUsers = this.userService.getUsers();
    this.currentUser = this.userService.getUserByUsername(this.authService.getCurrentUsername());
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  getTotalIncome(): number {
    let totalIncome = 0;
    for (const user of this.allUsers) {
      totalIncome += (user.income + user.balance);
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
      totalBalance += user.currentBalance;
    });
    return totalBalance;
  }

  getTotalIncomeBalance(user: UserInterface) {
    const decimalIncome = new Decimal(user.income);
    const decimalBalance = new Decimal(user.balance);
     return decimalIncome.plus(decimalBalance);
  }

  protected readonly faArrowTrendUp = faArrowTrendUp;
  protected readonly faArrowTrendDown = faArrowTrendDown;
  protected readonly faPiggyBank = faPiggyBank;
}

