import {Injectable} from '@angular/core';
import {Operation} from "../interface/operation";
import {UserInterface} from "../interface/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {
  }

  login(username: string, password: string): boolean {
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    const user = usersData[username];
    if (user && user.password == password) {
      localStorage.setItem('isLoggedIn', username);
      return true;
    } else {
      return false;
    }
  }

  isUnique(username: string): boolean {
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    return !usersData[username];
  }

  isAuthenticated(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return !!isLoggedIn;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
  }

  registration(user: UserInterface): void {
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    usersData[user.username] = user;
    localStorage.setItem('users', JSON.stringify(usersData));
  }

  getCurrentUsername(): string {
    return localStorage.getItem('isLoggedIn') ?? '';
  }

  removeUser(username: string): void {
    const usersData: { [key: string]: UserInterface } = JSON.parse(localStorage.getItem('users') ?? '{}');
    const operations: Operation[] = JSON.parse(localStorage.getItem('operations') ?? '[]');
    const filteredOperations = operations.filter(operation => operation.from != username && operation.to != username);
    Object.keys(usersData).forEach(userKey => {
      if (userKey != username) {
        let income = 0;
        let outgoing = 0;
        filteredOperations.forEach(operation => {
          if (operation.to == userKey) {
            income += operation.amount;
          }
          if (operation.from == userKey) {
            outgoing += operation.amount;
          }
        });
        usersData[userKey].income = income;
        usersData[userKey].outgoing = outgoing;
      }
    });
    delete usersData[username];
    localStorage.setItem('users', JSON.stringify(usersData));
    localStorage.setItem('operations', JSON.stringify(filteredOperations));
  }

}


