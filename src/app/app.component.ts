import {Component} from '@angular/core';
import {ChildrenOutletContexts, RouterOutlet} from '@angular/router';
import { RouterLink } from "@angular/router";
import { AuthService } from "./auth-service";
import { CommonModule } from "@angular/common";
import { RouterLinkActive } from "@angular/router";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faSignature } from "@fortawesome/free-solid-svg-icons";
import { faPiggyBank } from "@fortawesome/free-solid-svg-icons";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {sAnimation} from "./animation";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive, FaIconComponent],
  templateUrl: 'app.component.html',
  styleUrl: './app.component.css',
   animations: [sAnimation]
})

export class AppComponent {
  faUsers = faUsers;
  faSignature = faSignature;
  faPiggy = faPiggyBank;
  title = 'home';

  constructor(private authService: AuthService, private contexts: ChildrenOutletContexts) {
  }
  getRouteAnimationData() {
  return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
}

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    location.reload();
  }

  getCurrentUsername(): string {
    return this.authService.getCurrentUsername();
  }

  getDate(): string {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear().toString();
    const formattedDate = `${day}.${month}.${year}`;
    return formattedDate;
  }

}
