import {Injectable} from '@angular/core';
import {UserService} from './user.service';
import {Decimal} from 'decimal.js';
import {Operation} from "../interface/operation";
import {UserInterface} from "../interface/user";

@Injectable({
  providedIn: 'root',
})
export class OperationsService {

  constructor(private userService: UserService) {
  }

  removeUser(username: string): void {
    const removeUser = this.userService.getUserByUsername(username);
    if (!removeUser) return;

    const operationsStr = localStorage.getItem('operations');
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');

    if (operationsStr) {
      const allOperations = JSON.parse(operationsStr);
      const updatedOperations = allOperations.filter((operation: Operation) => {
          const amountDecimal = new Decimal(operation.amount);
          if (operation.from == removeUser.username) {
            const receiver = usersData[operation.to];
            if (receiver) {
              receiver.income = new Decimal(receiver.income).minus(amountDecimal).toString();
              receiver.currentBalance = new Decimal(receiver.balance).plus(receiver.income).minus(receiver.outgoing).toString();
            }
          }
          if (operation.to == removeUser.username) {
            const sender = usersData[operation.from];
            if (sender) {
              sender.outgoing = new Decimal(sender.outgoing).minus(amountDecimal).toString();
              sender.currentBalance = new Decimal(sender.balance).plus(sender.income).minus(sender.outgoing).toString();
            }
          }
      });
      delete usersData[removeUser.username];
      localStorage.setItem('users', JSON.stringify(usersData));
      localStorage.setItem('operations', JSON.stringify(updatedOperations));
    }
  }

  //
  submitOperation(operationType: string, amount: string, currentUsername: string, receiverUsername?: string, date?: Date, comment?: string): void {
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');
    const currentUser = usersData[currentUsername];
    const amountDecimal = new Decimal(amount);
    if (!currentUser) return;

    if (operationType == 'outgoing' && currentUser) {
      currentUser.currentBalance = new Decimal(currentUser.currentBalance).minus(amountDecimal).toFixed(2);
      currentUser.outgoing = new Decimal(currentUser.outgoing).plus(amountDecimal).toFixed(2);
      const toUser = receiverUsername ? usersData[receiverUsername] : undefined;
      if (toUser) {
        toUser.currentBalance = new Decimal(toUser.currentBalance).plus(amountDecimal).toFixed(2);
        toUser.income = new Decimal(toUser.income).plus(amountDecimal).toFixed(2);
      }
      this.recordOperation(currentUser, toUser, amountDecimal, usersData, date, comment);
    } else if (operationType == 'income' && currentUser) {
      currentUser.currentBalance = new Decimal(currentUser.currentBalance).plus(amountDecimal).toFixed(2);
      currentUser.income = new Decimal(currentUser.income).plus(amountDecimal).toFixed(2);
      this.recordOperation(undefined, currentUser, amountDecimal, usersData, date, comment);
    }
  }

  private recordOperation(fromUser: UserInterface | undefined, toUser: UserInterface | undefined, amount: Decimal, usersData: any, date: Date = new Date(), comment: string = ''): void {
    const operation = {
      id: Date.now(),
      from: fromUser ? fromUser.username : undefined,
      to: toUser ? toUser.username : undefined,
      fromUID: fromUser ? fromUser.uid : undefined,
      toUID: toUser ? toUser.uid : undefined,
      amount: amount.toFixed(2),
      datetime: date,
      comment: comment
    };
    const operationsList = JSON.parse(localStorage.getItem('operations') || '[]');
    operationsList.push(operation);
    localStorage.setItem('operations', JSON.stringify(operationsList));
    localStorage.setItem('users', JSON.stringify(usersData));
  }
  ///
  removeOperation(operationId: number): void {
    const operationsList: Operation[] = JSON.parse(localStorage.getItem('operations') ?? '[]');
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    const operationToRemove = operationsList.find(operation => operation.id == operationId);

    if (operationToRemove) {
      if (operationToRemove.toUID == undefined) {  // Receiver 'N/A'
        this.senderBalance(operationToRemove, usersData);
      } else if (operationToRemove.fromUID == undefined) {  // Sender 'N/A'
        this.receiverBalance(operationToRemove, usersData);
      } else {
        this.bothBalances(operationToRemove, usersData);
      }
      const filteredOperations = operationsList.filter(operation => operation.id != operationId);
      localStorage.setItem('operations', JSON.stringify(filteredOperations));
      localStorage.setItem('users', JSON.stringify(usersData));
    }
  }

  private senderBalance(operation: Operation, usersData: any): void {
    const senderKey = Object.keys(usersData).find(key => usersData[key].uid == operation.fromUID);
    if (senderKey != undefined) {
      const sender = usersData[senderKey];
      if (sender) {
        sender.currentBalance = new Decimal(sender.currentBalance).plus(operation.amount).toFixed(2);
        sender.outgoing = new Decimal(sender.outgoing).minus(operation.amount).toFixed(2);
      }
    }
  }

  private receiverBalance(operation: Operation, usersData: any): void {
    const receiverKey = Object.keys(usersData).find(key => usersData[key].uid == operation.toUID);
    if (receiverKey != undefined) {
      const receiver = usersData[receiverKey];
      if (receiver) {
        receiver.currentBalance = new Decimal(receiver.currentBalance).minus(operation.amount).toFixed(2);
        receiver.income = new Decimal(receiver.income).minus(operation.amount).toFixed(2);
      }
    }
  }

  private bothBalances(operation: Operation, usersData: any): void {
    const senderKey = Object.keys(usersData).find(key => usersData[key].uid == operation.fromUID);
    const receiverKey = Object.keys(usersData).find(key => usersData[key].uid == operation.toUID);

    if (senderKey != undefined) {
      const sender = usersData[senderKey];
      if (sender) {
        sender.outgoing = new Decimal(sender.outgoing).minus(operation.amount).toFixed(2);
        sender.currentBalance = new Decimal(sender.currentBalance).plus(operation.amount).toFixed(2);
      }
    }
    if (receiverKey != undefined) {
      const receiver = usersData[receiverKey];
      if (receiver) {
        receiver.income = new Decimal(receiver.income).minus(operation.amount).toFixed(2);
        receiver.currentBalance = new Decimal(receiver.currentBalance).minus(operation.amount).toFixed(2);
      }
    }
  }

}
