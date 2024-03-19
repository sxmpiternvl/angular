import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth-service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {CreateOperationComponent} from "../create-operation/create-operation.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faHourglassStart} from "@fortawesome/free-solid-svg-icons";
import {faArrowTrendUp} from "@fortawesome/free-solid-svg-icons";
import {faArrowTrendDown} from "@fortawesome/free-solid-svg-icons";
import {faHourglassEnd} from "@fortawesome/free-solid-svg-icons";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, FaIconComponent],
  template: `

    <div class=" bg-white pl-4 pr-4 pb-4 rounded-2xl">
      <p class="mb-2 text-4xl">Статистика</p>
      <div class="flex justify-between">
        <div class="flex gap-2 flex-row items-center">
          <div class="rounded-xl bg-blue-700 px-2 py-2 w-12 text-2xl text-center">
            <fa-icon [icon]="faHourGlasses"></fa-icon>
          </div>
          <div class=""><p>Баланс на начало</p>
            <p>10 000</p>
          </div>
        </div>

        <div class="flex gap-2 flex-row items-center">
          <div class="rounded-xl bg-green-500 px-2 py-2 w-12 text-2xl text-center">
            <fa-icon [icon]="arrowTrendUp"></fa-icon>
          </div>
          <div class=""><p>Баланс на начало</p>
            <p>10 000</p>
          </div>
        </div>
        <div class="flex gap-2 flex-row items-center">
          <div class="rounded-xl bg-red-500 px-2 py-2 w-12 text-2xl text-center">
            <fa-icon [icon]="arrowTrendDown"></fa-icon>
          </div>
          <div class="ml-4"><p>Баланс на начало</p>
            <p>10 000</p>
          </div>
        </div>
        <div class="flex gap-2 flex-row items-center">
          <div class="rounded-xl bg-blue-700 px-2 py-2 w-12 text-2xl text-center">
            <fa-icon [icon]="hourGlassEnd"></fa-icon>
          </div>
          <div class="ml-4"><p>Баланс на начало</p>
            <p>10 000</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white mt-4 flex justify-between rounded-2xl p-4 mb-4">
      <p class="text-2xl">Операции</p>
      <form>
        <button mat-raised-button (click)="openOperationDialog()" class="flex justify-end">

          <div id="newOperation"
            class="rounded-xl pt-1.5 w-40 text-center h-10 text-blue-700 border-2 border-blue-900 align-text-bottom hover:bg-blue-700 hover:text-white transition-colors">
            <p> Новая операция
              <fa-icon [icon]="plus" class="text-blue-700 "></fa-icon>
            </p>
          </div>

        </button>
      </form>
    </div>

    <div>
      <div class=" overflow-y-scroll h-[400px] bg-white rounded-2xl">
        <table class="w-full">
          <thead class="sticky top-0 bg-white">
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
              <button (click)="removeOperation(i)">
                <fa-icon [icon]="trash" class="text-black ml-4"></fa-icon>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>






  `,
  styleUrl: './operations.component.css'
})
export class OperationsComponent implements OnInit {
  currentUsername = this.authService.getCurrentUsername();
  operationsList: any[] = [];
  filteredOperationsList: any[] = [];
  faHourGlasses = faHourglassStart;
  arrowTrendUp = faArrowTrendUp;
  arrowTrendDown = faArrowTrendDown;
  hourGlassEnd = faHourglassEnd;
  plus = faPlus;
  trash = faTrash;


  constructor(private authService: AuthService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.currentUsername = this.authService.getCurrentUsername();
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

  openOperationDialog(): void {
    const _popup = this.dialog.open(CreateOperationComponent, {
      width: '410px',
      data: {
        currentUsername: this.currentUsername,
      }
    });
    _popup.afterClosed().subscribe(res => {
      location.reload();
    })
  }
}
