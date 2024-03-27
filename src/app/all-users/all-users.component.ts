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
import {ModalComponent} from "../modal/modal.component";

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent, RegistrationComponent, ModalComponent],
  template: `
    <div class="absolute inset-0 flex flex-col p-3 pb-10">
      <div class="bg-white p-2 rounded-2xl">
        <p class="mb-2 text-4xl p-2.5">Статистика</p>
        <div class="flex flex-row px-4 pb-2 gap-2.5">
          <div class="rounded-xl bg-primary   px-2 py-2 w-12 text-2xl text-center">
            <fa-icon [icon]="faUser"></fa-icon>
          </div>
          <div class="text-blue-700">
            <p>Всего пользователей</p>
            <p>{{allUsers.length}}</p>
          </div>
        </div>
      </div>
      <div class="flex-1 bg-white mt-4 rounded-2xl  w-full overflow-y-scroll">
        <div>
          <div class="grid grid-cols-2 grid-rows-1 pb-2 overflow-y-scroll">
            <div class="h-12"><p class="text-2xl px-4 pt-4">Пользователи</p></div>
            @if(!currentUser){
              <button class="flex justify-end px-4 pt-2" (click)="openModal('registration')" >
              <div id="newOperation"
                   class="custom-btn-primary">
                <p> Новый пользователь
                  <fa-icon [icon]="plus" class="text-blue-700 "></fa-icon>
                </p>
              </div>
            </button>
            }
          </div>
          <div class="bg-white rounded-2xl">
            <table class="w-full">
              <thead class="sticky top-0 bg-neutral-100 rounded-2xl p-16">
              <tr>
                <th>Имя</th>
                <th>Логин</th>
                <th>Действия</th>
              </tr>
              </thead>
              <div class="sticky top-0">
              </div>
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
    <app-modal [show]="showModal" [modalType]="modalName" (close)="closeModal()"></app-modal>
  `,
  animations: [routeAnimationState],
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent {
  @HostBinding('@routeAnimationTrigger') routeAnimation = true;
  currentUser: any;
  faUser = faUser;
  trash = faTrash;
  plus = faPlus;
  allUsers: { username: string, name: string; }[] = [];
  showModal: boolean = false;
  modalName: string = '';

  constructor(private userService: UserService, private authService: AuthService) {
    this.getUsers();
  }

  getUsers(): void {
    this.allUsers = this.userService.getUsers();
    this.currentUser = this.userService.getUserByUsername(this.authService.getCurrentUsername());
  }

  removeUser(username: string): void {
    this.authService.removeUser(username);
    location.reload();
  }

  openModal(modalType: string): void {
    this.showModal = true;
    this.modalName = modalType;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalName = '';
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
