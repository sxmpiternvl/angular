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

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent, CreateOperationComponent],
  template: `
    <div class="bg-white p-2 rounded-2xl">
      <p class="mb-2 text-4xl p-2.5">Статистика</p>
      <div class="flex justify-between px-4 pb-2">
        <div class="flex gap-2 flex-row items-center">
          <div class="rounded-xl bg-blue-700 px-2 py-2 w-12 text-2xl text-center">
            <fa-icon [icon]="faHourGlasses"></fa-icon>
          </div>
          <div class=""><p>Баланс на начало</p>
            <p>0</p>
          </div>
        </div>

        <div class="flex gap-2 flex-row items-center">
          <div class="rounded-xl bg-green-500 px-2 py-2 w-12 text-2xl text-center">
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
          <div class="rounded-xl bg-red-500 px-2 py-2 w-12 text-2xl text-center">
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
          <div class="rounded-xl bg-blue-700 px-2 py-2 w-12 text-2xl text-center">
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

    <div class="bg-white mt-4 rounded-2xl p-4 w-full">
      <div class="flex flex-row justify-between pb-4">
        <div class="h-10">  <p class="text-2xl">Операции</p> </div>
        <form>
          <button (click)="this.isPopUpOpened=true" class="flex justify-end">
            <div id="newOperation"
                 class="rounded-xl w-40 h-10 text-blue-700 border-2 border-blue-900 hover:bg-blue-700 hover:text-white
                  transition-colors duration-300 pt-1.5">
              <p > Новая операция
                <fa-icon [icon]="plus" class="text-blue-700 "></fa-icon>
              </p>
            </div>
          </button>
        </form>
      </div>
      <div class=" overflow-y-scroll h-[400px] bg-white rounded-2xl">
        <table class="w-full">
          <thead class="sticky top-0 bg-neutral-100">
          <tr>
            <th class="p-2.5">Дата</th>
            <th class="p-2.5">От кого</th>
            <th class="p-2.5">Кому</th>
            <th class="p-2.5">Сумма</th>
            <th class="p-2.5">Action</th>
          </tr>
          </thead>
          <tbody class="w-full">
          <tr *ngFor="let operation of filteredOperationsList; let i = index">
            <td class="font-mono">{{operation.datetime}}</td>
            <td>{{ operation.from }}</td>
            <td>{{ operation.to }}</td>
            <td class="font-mono">{{ operation.amount }}</td>
            <td>
              <button (click)="removeOperation(i)">
                <fa-icon [icon]="trash" class="text-black ml-4"></fa-icon>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <app-create-operation (close)="onClose()" [show]="this.isPopUpOpened"></app-create-operation>
  `,
  styleUrl: './operations.component.css',
    animations: [routeAnimationState],
})
export class OperationsComponent  {
  @HostBinding('@routeAnimationTrigger') routeAnimation = true;
  isPopUpOpened = false;
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

  onClose(): void {
    this.isPopUpOpened = false;
    location.reload();
  }

}
