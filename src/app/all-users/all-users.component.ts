import {Component, HostBinding,} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {UserService} from "../user.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {AuthService} from "../auth-service";
import {routeAnimationState} from "../route.animations";
import {RegistrationComponent} from "../registration/registration.component";

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent, RegistrationComponent],
  template: `
    <div class="h-[calc(100vh-45px)]">
      <div class="bg-white p-2 rounded-2xl">
      <p class="mb-2 text-4xl p-2.5">Статистика</p>
      <div class="flex flex-row px-4 pb-2 gap-2.5">
        <div class="rounded-xl bg-blue-700 px-2 py-2 w-12 text-2xl text-center">
          <fa-icon [icon]="faUser"></fa-icon>
        </div>
        <div class="text-blue-700">
          <p>Всего пользователей</p>
          <p>{{allUsers.length}}</p>
        </div>
      </div>
    </div>
    <div>
      <div class="bg-white mt-4 rounded-2xl p-4 w-full">
        <div class=" grid grid-cols-2 grid-rows-1 pb-4">
          <div class="h-10"><p class="text-2xl">Пользователи</p></div>
          @if(!authenticated()){
          <button class="flex justify-end" (click)="this.isPopUpOpened=true" >
            <div id="newOperation"
                 class="rounded-xl pt-1.5 w-52 text-center h-10 text-blue-700 border-2 border-blue-900 align-text-bottom
                    hover:bg-blue-700 hover:text-white transition-colors">
              <p> Новый пользователь
                <fa-icon [icon]="plus" class="text-blue-700 "></fa-icon>
              </p>
            </div>
          </button>
           }
        </div>
        <div class=" overflow-y-scroll h-[400px] bg-white rounded-2xl" >
          <table class="w-full">
            <thead class="sticky top-0 bg-neutral-100 rounded-2xl p-16">
            <tr>
              <th class="p-2.5">Имя</th>
              <th class="p-2.5">Логин</th>
              <th class="p-2.5">Действия</th>
            </tr>
            </thead>
            <tbody class="w-full">
            <tr *ngFor="let user of allUsers; let i = index">
              <td class="">{{ user.name }}</td>
              <td class="">{{ user.username }}</td>
              <td class="">
                <button (click)="removeUser(user.username)">
                  <fa-icon [icon]="trash" class="text-black ml-4"></fa-icon>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
<app-registration (close)="onClose()" [a]="this.isPopUpOpened"></app-registration>


  `,
   animations: [routeAnimationState],
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent {
  @HostBinding('@routeAnimationTrigger') routeAnimation = true;
  isPopUpOpened = false;
  currentUser: any;
  faUser = faUser;
  trash = faTrash;
  plus = faPlus;
  allUsers: { username: string, name: string; }[] = [];

  constructor(private userService: UserService, private authService: AuthService) {
    this.getUsers();
  }

  getUsers(): void {
    this.allUsers = this.userService.getUsers();
     this.currentUser = this.userService.getUserByUsername(this.authService.getCurrentUsername());
  }

  removeUser(username:string): void {
    this.authService.removeUser(username);
    location.reload();
  }
  authenticated(): boolean {
   return this.authService.isAuthenticated();
  }


   onClose(): void {
    this.isPopUpOpened = false;
    location.reload();
  }
}



// remove(): void {
//   const removeUsername = localStorage.getItem(this.removeUser);
//   if (removeUsername) {
//     this.operations = localStorage.getItem('operations');
//     if (this.operations) {
//       const allOperations: Operation[] = JSON.parse(this.operations);
//       const updatedOperations = allOperations.filter((operation: Operation) =>
//         (operation.from !== this.removeUser) && (operation.to !== this.removeUser)
//       );
//       localStorage.setItem('operations', JSON.stringify(updatedOperations));
//     }
//     localStorage.removeItem(this.removeUser);
//     location.reload();
//   }
// }
