import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {AuthService} from "../auth-service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {CreateOperationComponent} from "../create-operation/create-operation.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faHourglassStart} from "@fortawesome/free-solid-svg-icons";
import {faArrowTrendUp} from "@fortawesome/free-solid-svg-icons";
import {faArrowTrendDown} from "@fortawesome/free-solid-svg-icons";
import {faHourglassEnd} from "@fortawesome/free-solid-svg-icons";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {UserService} from "../user.service";
import {routeAnimationState} from "../route.animations";
import {ModalComponent} from "../modal/modal.component";

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent, CreateOperationComponent, ModalComponent],
  template: `
    <div class="absolute inset-0 flex flex-col p-3 pb-10">
      <div class="bg-white p-2 rounded-2xl">
        <p class="mb-2 text-4xl p-2.5">Статистика</p>
        <div class="flex justify-between px-4 pb-2">
          <div class="flex gap-2 flex-row items-center">
            <div class="stat-primary">
              <fa-icon [icon]="faHourGlasses"></fa-icon>
            </div>
            <div class=""><p>Баланс на начало</p>
              <p>0</p>
            </div>
          </div>
          <div class="flex gap-2 flex-row items-center">
            <div class="stat-success">
              <fa-icon [icon]="arrowTrendUp"></fa-icon>
            </div>
            <div class=""><p>Приход</p>
              @if(currentUser){
              <p>
              {{currentUser.income}}
              </p>
              }
              @else{
              <p>
              0</p>
              }
            </div>
          </div>
          <div class="flex gap-2 flex-row items-center">
            <div class="stat-error">
              <fa-icon [icon]="arrowTrendDown"></fa-icon>
            </div>
            <div class="ml-4"><p>Расход</p>
              @if(currentUser){
              <p>
              {{currentUser.outgoing}}
              </p>
              }
              @else{
              <p>
              0</p>
              }
            </div>
          </div>
          <div class="flex gap-2 flex-row items-center">
            <div class="stat-primary">
              <fa-icon [icon]="hourGlassEnd"></fa-icon>
            </div>
            <div class="ml-4"><p>Баланс на конец</p>
              @if(currentUser){
              <p>
              {{currentUser.balance}}
              </p>
              }
              @else{
              <p>
              0</p>
              }
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white mt-4 rounded-2xl w-full overflow-y-scroll flex-1 ">
        <div class="flex flex-row justify-between pb-2">
          <div class="h-12"><p class="text-2xl px-4 pt-4">Операции</p></div>
          <form>

            <button class="flex justify-end px-4 pt-2" (click)="openModal('createOperation')">
              <div id="newOperation"
                   class="custom-btn-primary">
                <p> Новая операция
                  <fa-icon [icon]="plus" class="text-blue-700 "></fa-icon>
                </p>
              </div>
            </button>

          </form>
        </div>
        <div class=" bg-white rounded-2xl">
          <table class="w-full">
            <thead class="sticky top-0 bg-neutral-100 rounded-2xl p-16">
            <tr>
              <th>Дата</th>
              <th>От кого</th>
              <th>Кому</th>
              <th>Сумма</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody class="w-full">
            <tr *ngFor="let operation of filteredOperationsList; let i = index">
              <td class="font-mono">{{operation.datetime}}</td>
              <td>{{ operation.from }}</td>
              <td>{{ operation.to }}</td>
              <td class="font-mono">{{ operation.amount }}</td>
              <td>
                <button (click)="openModal('removeOperation')">
                  <fa-icon [icon]="trash" class="text-black ml-4"></fa-icon>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <app-modal [show]="showModal" [modalType]="modalType" (close)="closeModal()"></app-modal>

    </div>
  `,
  styleUrl: './operations.component.css',
  animations: [routeAnimationState],
})
export class OperationsComponent {
  @HostBinding('@routeAnimationTrigger') routeAnimation = true;
  currentUsername = this.authService.getCurrentUsername();
  operationsList: any[] = [];
  filteredOperationsList: any[] = [];
  currentUser: any;

  faHourGlasses = faHourglassStart;
  arrowTrendUp = faArrowTrendUp;
  arrowTrendDown = faArrowTrendDown;
  hourGlassEnd = faHourglassEnd;
  plus = faPlus;
  trash = faTrash;
  showModal: boolean = false;
  modalType: string = '';

  constructor(private authService: AuthService, private userService: UserService) {
    this.currentUser = this.userService.getUserByUsername(this.authService.getCurrentUsername());
    this.loadOperations();
    this.updateFilteredOperations();
  }

  loadOperations(): void {
    const operationsData = localStorage.getItem('operations');
    if (operationsData) {
      this.operationsList = JSON.parse(operationsData);
    }
  }

  updateFilteredOperations(): void {
    this.filteredOperationsList = this.operationsList.filter(
      operation => operation.from === this.currentUsername || operation.to === this.currentUsername
    );
  }

  removeOperation(index: number): void {
    this.operationsList.splice(index, 1);
    localStorage.setItem('operations', JSON.stringify(this.operationsList));
    location.reload();
  }

  openModal(modalType: string): void {
    this.showModal = true;
    this.modalType = modalType;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalType = '';
  }

}
