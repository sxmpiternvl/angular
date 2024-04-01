import {Injectable} from '@angular/core';
import {Operation} from "./operation";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {
    this.usersExists();
  }

   usersExists(): void {
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    if (!usersData) {
      localStorage.setItem('users', JSON.stringify({}));
    }
  }



  login(username: string, password: string): boolean {
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    const user = usersData[username];
    if (user && user.password === password) {
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

    registration(username: string, password: string, name: string, uid:string): void {
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    usersData[username] = { username, password, name, balance: 10000, income: 0, outgoing: 0, uid };
    localStorage.setItem('users', JSON.stringify(usersData));
  }

   getCurrentUsername(): string {
    const username = localStorage.getItem('isLoggedIn');
    if (username) {
      return username;
    }
    return '';
  }

  removeUser(username: string): void {
    const usersData: { [key: string]: any } = JSON.parse(localStorage.getItem('users') ?? '{}');
    const operations: Operation[] = JSON.parse(localStorage.getItem('operations') ?? '[]');
    const filteredOperations = operations.filter(operation => operation.from !== username && operation.to !== username);
    Object.keys(usersData).forEach(userKey => {
      if (userKey !== username) {
        let income = 0;
        let outgoing = 0;
        filteredOperations.forEach(operation => {
          if (operation.to === userKey) {
            income += operation.amount;
          }
          if (operation.from === userKey) {
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


