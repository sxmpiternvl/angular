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
    return isLoggedIn != null;
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

}


