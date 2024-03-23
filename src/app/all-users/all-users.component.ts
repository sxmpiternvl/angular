import {Component,} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {UserService} from "../user.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {AuthService} from "../auth-service";

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent],
  template: `
    <div class="bg-white p-2 rounded-2xl">
      <p class="mb-2 text-4xl p-2.5">Статистика</p>
      <div class="flex flex-row px-4 pb-2 gap-2.5">
        <div class="rounded-xl bg-blue-700 px-2 py-2 w-12 text-2xl text-center">
          <fa-icon [icon]="faUser"></fa-icon>
        </div>
        <div class="text-blue-700">
          <p>Всего пользователей</p>
          <p>10</p>
        </div>
      </div>
    </div>
    <div>
      <div class="bg-white mt-4 rounded-t-2xl p-4 w-full">
        <div class=" grid grid-cols-2 grid-rows-1 pb-4">
          <p class="text-2xl">Пользователи</p>
          @if(!authenticated()){
          <button class="flex justify-end">
            <div id="newOperation"
                 class="rounded-xl pt-1.5 w-52 text-center h-10 text-blue-700 border-2 border-blue-900 align-text-bottom
                    hover:bg-blue-700 hover:text-white transition-colors">
              <a routerLink="/registration"> Новый пользователь
                <fa-icon [icon]="plus" class="text-blue-700 "></fa-icon>
              </a>
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


  `,
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent {
  faUser = faUser;
  trash = faTrash;
  plus = faPlus;
  allUsers: { username: string, name: string; }[] = [];

  constructor(private userService: UserService, private authService: AuthService) {
    this.getUsers();
  }

  getUsers(): void {
    this.allUsers = this.userService.getUsers();
  }

  removeUser(username:string): void {
    this.authService.removeUser(username);
    location.reload();
  }
  authenticated(): boolean {
   return this.authService.isAuthenticated();
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
