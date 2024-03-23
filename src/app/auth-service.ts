import {Injectable} from '@angular/core';

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

    registration(username: string, password: string, name: string): void {
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    usersData[username] = { username, password, name, balance: 10000, income: 0, outgoing: 0 };
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
  const updatedUsersData: { [key: string]: any } = {};
  for (const key in usersData) {
    if (key !== username) {
      updatedUsersData[key] = usersData[key];
    }
  }
  localStorage.setItem('users', JSON.stringify(updatedUsersData));
}

}


