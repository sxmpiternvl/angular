import {Component} from '@angular/core';
import {AuthService} from "../auth-service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {CreateOperationComponent} from "../create-operation/create-operation.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  faArrowTrendDown,
  faArrowTrendUp,
  faHourglassEnd,
  faHourglassStart,
  faPlus,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import {UserService} from "../user.service";
import {ModalComponent} from "../modal/modal.component";
import {DeleteOperationComponent} from "../delete-operation/delete-operation.component";
import {Operation} from "../operation";

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent, CreateOperationComponent, ModalComponent, DeleteOperationComponent],
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
              @if (currentUser) {
                <p> 10000 </p>
              } @else {
                <p>***</p>
              }
            </div>
          </div>
          <div class="flex gap-2 flex-row items-center">
            <div class="stat-success">
              <fa-icon [icon]="arrowTrendUp"></fa-icon>
            </div>
            <div class=""><p>Приход</p>
              @if(currentUser){
                <p>{{currentUser.income}}</p>
              } @else {
                <p>***</p>
              }
            </div>
          </div>
          <div class="flex gap-2 flex-row items-center">
            <div class="stat-error">
              <fa-icon [icon]="arrowTrendDown"></fa-icon>
            </div>
            <div class="ml-4"><p>Расход</p>
              @if (currentUser){
                <p>{{currentUser.outgoing}}</p>
              } @else {
                <p> *** </p>
              }
            </div>
          </div>
          <div class="flex gap-2 flex-row items-center">
            <div class="stat-primary">
              <fa-icon [icon]="hourGlassEnd"></fa-icon>
            </div>
            <div class="ml-4"><p>Баланс на конец</p>
              @if (currentUser) {
                <p>{{ currentUser.balance}}</p>
              } @else {
                <p>***</p>
              }
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white mt-4 rounded-2xl w-full overflow-y-scroll flex-1 ">
        <div class="flex flex-row justify-between pb-2">
          <div class="h-12"><p class="text-2xl px-4 pt-4">Операции</p></div>
          <form>
            <button class="flex justify-end px-4 pt-2" (click)="create.open()">
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
              <td class="font-mono">{{ operation.datetime }}</td>
              <td>{{ operation.from }}</td>
              <td>{{ operation.to }}</td>
              <td class="font-mono">{{ operation.amount }}</td>
              <td>
                <button>
                  <fa-icon (click)="deleteOp.open(); this.removeOperationId=operation.id" [icon]="trash"
                           class="text-black ml-4"></fa-icon>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <app-modal #create [content]="modalContent">
        <ng-template #modalContent>
          <app-create-operation (close)="create.close(); updateFilteredOperations()"></app-create-operation>
        </ng-template>
      </app-modal>
      <app-modal #deleteOp [content]="modalDeleteOperationContent">
        <ng-template #modalDeleteOperationContent>
          <app-delete-operation (submit)="this.removeOperation(this.removeOperationId); deleteOp.close()"
                                (close)="deleteOp.close()"></app-delete-operation>
        </ng-template>
      </app-modal>
    </div>
  `,
  styleUrl: './operations.component.css',
})
export class OperationsComponent {
  filteredOperationsList: Operation[] = [];
  currentUser: any;
  removeOperationId: number = -1;
  faHourGlasses = faHourglassStart;
  arrowTrendUp = faArrowTrendUp;
  arrowTrendDown = faArrowTrendDown;
  hourGlassEnd = faHourglassEnd;
  plus = faPlus;
  trash = faTrash;

  constructor(private authService: AuthService, private userService: UserService) {
    this.updateFilteredOperations();
  }

  updateFilteredOperations(): void {
    this.filteredOperationsList = [];
    const operationsData: Operation[] = JSON.parse(localStorage.getItem('operations') || '[]');
    if (this.authService.isAuthenticated()) {
      this.currentUser = this.userService.getUserByUsername(this.authService.getCurrentUsername());
      if (this.currentUser && this.currentUser.uid) {
        const currentUserUID = this.currentUser.uid;
        this.filteredOperationsList = operationsData.filter(operation =>
          operation.fromUID == currentUserUID || operation.toUID == currentUserUID
        );
      }
    } else {
      this.filteredOperationsList = operationsData;
      console.log(this.filteredOperationsList);
    }
  }
  removeOperation(operationId: number): void {
    const operationsList: Operation[] = JSON.parse(localStorage.getItem('operations') ?? '[]');
    const filteredOperations = operationsList.filter((operation: Operation) => operation.id != operationId);
    localStorage.setItem('operations', JSON.stringify(filteredOperations));
    this.updateFilteredOperations();
  }



}
