import {Component} from '@angular/core';
import {AuthService} from "../../services/auth-service";
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
import {UserService} from "../../services/user.service";
import {ModalComponent} from "../../modal/modal.component";
import {DeleteOperationComponent} from "../delete-operation/delete-operation.component";
import {Operation} from "../../interface/operation";
import {UserInterface} from "../../interface/user";

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent, CreateOperationComponent, ModalComponent, DeleteOperationComponent],
  templateUrl: 'operations.component.html',
  styleUrl: './operations.component.css',
})
export class OperationsComponent {
  filteredOperationsList: Operation[] = [];
  currentUser: UserInterface | null = null;
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
    const currentUserUsername = this.authService.getCurrentUsername();
    if (currentUserUsername) {
      this.currentUser = this.userService.getUserByUsername(currentUserUsername);
      if (this.currentUser) {
        let currentUserUID = this.currentUser.uid;
        this.filteredOperationsList = operationsData.filter(operation =>
          operation.fromUID == currentUserUID || operation.toUID == currentUserUID
        );
      }
    } else {
      this.filteredOperationsList = operationsData;
    }
  }
  removeOperation(operationId: number): void {
    const operationsList: Operation[] = JSON.parse(localStorage.getItem('operations') ?? '[]');
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    const operationToRemove = operationsList.find(operation => operation.id == operationId);
    if (operationToRemove) {
      let sender, receiver;
      for (let username in usersData) {
        if (usersData[username].uid == operationToRemove.fromUID) {
          sender = usersData[username];
          sender.outgoing -= operationToRemove.amount;
          sender.currentBalance +=operationToRemove.amount;
        } else if (usersData[username].uid == operationToRemove.toUID) {
          receiver = usersData[username];
          receiver.income -= operationToRemove.amount;
          receiver.currentBalance -= operationToRemove.amount;
        }
      }
      localStorage.setItem('users', JSON.stringify(usersData));
      const filteredOperations = operationsList.filter(operation => operation.id != operationId);
      localStorage.setItem('operations', JSON.stringify(filteredOperations));
      this.updateFilteredOperations();
    }
  }

}
