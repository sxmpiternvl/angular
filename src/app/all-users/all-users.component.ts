import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {UserService} from "../user.service";
import {AuthService} from "../auth-service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent],
  template: `
<div class="bg-white p-2">

       <p class="text-2xl p-2">Статистика</p>
           <div class="flex flex-row p-2 gap-2.5">
      <div class="rounded-xl bg-blue-700 px-2 py-2 w-12 text-2xl text-center">
        <fa-icon [icon]="faUser"></fa-icon>
      </div>
      <div class="text-blue-700">
        <p>Всего пользователей</p>
        <p>10</p>
      </div>
    </div>
</div>

    <div class="bg-white mt-4 flex justify-between rounded-2xl p-4 mb-4">
      <p class="text-2xl">Пользователи</p>

        <button mat-raised-button  class="flex justify-end">

          <div id="newOperation"
            class="rounded-xl pt-1.5 w-52 text-center h-10 text-blue-700 border-2 border-blue-900 align-text-bottom hover:bg-blue-700 hover:text-white transition-colors">
            <a routerLink="/registration"> Новый пользователь
              <fa-icon [icon]="plus" class="text-blue-700 "></fa-icon>
            </a>
          </div>

        </button>

    </div>

    <div class=" overflow-y-scroll h-[400px] bg-white rounded-2xl">
     <table class="w-full">
          <thead class="sticky top-0 bg-white">
          <tr>
            <th class="pr-40">Имя</th>
            <th class="pl-40">Логин</th>
            <th class="pl-80">Действия</th>
          </tr>
          </thead>
       <tbody class="w-full">
          <tr *ngFor="let user of usersList; let i = index">
            <td class="pr-40">{{ user.name }}</td>
            <td class="pl-40">{{ user.username }}</td>
            <td class="pl-80">
              <button (click)="removeUser(user.username)">
                <fa-icon [icon]="trash" class="text-black ml-4"></fa-icon>
              </button>
            </td>
          </tr>
          </tbody>
     </table>
    </div>

  `,
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent {
  faUser = faUser;
  trash = faTrash;
  plus = faPlus;
  usersList: { username: string, name: string; }[] = [];

  constructor(private userService: UserService, private authService: AuthService) {
  }

  getUsers(): void {
    this.usersList = this.userService.getUsersList();
  }

  ngOnInit(): void {
    this.getUsers();

  }

  removeUser(username: string): void {
    localStorage.removeItem(username);
    this.usersList = this.usersList.filter(user => user.username !== username);
  }



}
