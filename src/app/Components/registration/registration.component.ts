import {Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from "../../services/auth-service";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faLock} from "@fortawesome/free-solid-svg-icons";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {UserInterface} from "../../interface/user";

@Component({
  selector: 'app-registration',
  standalone: true,
  animations: [],
  imports: [
    FormsModule,
    CommonModule,
    FaIconComponent,
  ],
  templateUrl:'registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  faLock = faLock;
  faSave = faSave;
  faUser = faUser;

  constructor(private authService: AuthService, private router: Router) {
  }

  uid: string = Date.now().toString();
  confirmPassword: string = '';
  username: string = '';
  password: string = '';
  name: string = '';
  balance: number = 10000;
  income = 0;
  outgoing = 0;
  error: boolean = false;
  currentBalance = this.balance - this.outgoing + this.income;

  registration(): void {
    if (!this.authService.isUnique(this.username) || this.password != this.confirmPassword) {
      this.error = true;
      return;
    }
    if (this.username && this.password && this.name && this.uid) {
      const newUser: UserInterface = {
        username: this.username,
        password: this.password,
        name: this.name,
        uid: this.uid,
        income: this.income,
        outgoing: this.outgoing,
        balance: this.balance,
        currentBalance: this.currentBalance
      };

      this.authService.registration(newUser);
      this.authService.login(this.username, this.password);
      this.close.emit();
    }

  }
  isSpace(event:any){
    if (event.key == ' '){
      event.preventDefault();
    }
  }

}
