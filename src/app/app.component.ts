import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {RouterLink} from "@angular/router";
import {AuthService} from "./services/auth-service";
import {CommonModule, DatePipe} from "@angular/common";
import {RouterLinkActive} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUsers} from "@fortawesome/free-solid-svg-icons";
import {faSignature} from "@fortawesome/free-solid-svg-icons";
import {faPiggyBank} from "@fortawesome/free-solid-svg-icons";
import {sAnimation} from "./animation/animation";
import {faLock} from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive, FaIconComponent],
  providers: [DatePipe],
  templateUrl: 'app.component.html',
  animations: [sAnimation]
})

export class AppComponent {

  _date:Date = new Date();
  links = [
    {path: '/allUsers', icon: faUsers, label: 'Пользователи'},
    {path: '/operations', icon: faSignature, label: 'Операции'},
    {path: '/balances', icon: faPiggyBank, label: 'Балансы'},
  ];
  title = 'home';

  constructor(private authService: AuthService, private router: Router) {
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/'])
  }

  getCurrentUsername() {
    return this.authService.getCurrentUsername();
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }


  protected readonly faLock = faLock;
}
