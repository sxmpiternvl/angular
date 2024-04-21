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
        const involvesRemoveUser = operation.from == removeUser.username || operation.to == removeUser.username;
        if (involvesRemoveUser) {
          const amountDecimal = new Decimal(operation.amount);
          if (operation.from == removeUser.username) {
            const recipient = usersData[operation.to];
            if (recipient) {
              recipient.income = new Decimal(recipient.income).minus(amountDecimal).toString();
              recipient.currentBalance = new Decimal(recipient.balance).plus(recipient.income).minus(recipient.outgoing).toString();
            }
          }
          if (operation.to == removeUser.username) {
            const sender = usersData[operation.from];
            if (sender) {
              sender.outgoing = new Decimal(sender.outgoing).minus(amountDecimal).toString();
              sender.currentBalance = new Decimal(sender.balance).plus(sender.income).minus(sender.outgoing).toString();
            }
          }
        }
        return !involvesRemoveUser;
      });
      delete usersData[removeUser.username];
      localStorage.setItem('users', JSON.stringify(usersData));
      localStorage.setItem('operations', JSON.stringify(updatedOperations));
    }
  }

  //
  submitOperation(operationType: string, amount: string, currentUsername: string, receiverUsername?: string): void {
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');
    const currentUser = usersData[currentUsername];
    const amountDecimal = new Decimal(amount);
    if (!currentUser)
      return;
    if (operationType === 'outgoing' && currentUser) {
      currentUser.currentBalance = new Decimal(currentUser.currentBalance).minus(amountDecimal).toFixed(2);
      currentUser.outgoing = new Decimal(currentUser.outgoing).plus(amountDecimal).toFixed(2);
      const toUser = receiverUsername ? usersData[receiverUsername] : undefined;
      if (toUser) {
        toUser.currentBalance = new Decimal(toUser.currentBalance).plus(amountDecimal).toFixed(2);
        toUser.income = new Decimal(toUser.income).plus(amountDecimal).toFixed(2);
      }
      this.recordOperation(currentUser, toUser, amountDecimal, usersData);
    } else if (operationType === 'income' && currentUser) {
      currentUser.currentBalance = new Decimal(currentUser.currentBalance).plus(amountDecimal).toFixed(2);
      currentUser.income = new Decimal(currentUser.income).plus(amountDecimal).toFixed(2);
      this.recordOperation(undefined, currentUser, amountDecimal, usersData);
    }
  }

  private recordOperation(fromUser: UserInterface | undefined, toUser: UserInterface | undefined, amount: Decimal, usersData: any): void {
    const operation = {
      id: Date.now(),
      from: fromUser ? fromUser.username : undefined,
      to: toUser ? toUser.username : undefined,
      fromUID: fromUser ? fromUser.uid : undefined,
      toUID: toUser ? toUser.uid : undefined,
      amount: amount.toFixed(2),
      datetime: new Date(),
      comment: ''
    };
    const operationsList = JSON.parse(localStorage.getItem('operations') || '[]');
    operationsList.push(operation);
    localStorage.setItem('operations', JSON.stringify(operationsList));
    localStorage.setItem('users', JSON.stringify(usersData));
  }
  ///
}
