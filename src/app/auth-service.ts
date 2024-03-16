import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {
  }

  login(username: string, password: string): boolean {
    const user = JSON.parse(localStorage.getItem(username) || '{}');
    if (user && user.password === password) {
      localStorage.setItem('isLoggedIn', username);
      return true;
    } else {
      return false;
    }
  }

  isUnique(username: string): boolean {
    return !localStorage.getItem(username);
  }

  isAuthenticated(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return !!isLoggedIn;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
  }

  registration(username: string, password: string, name: string, lastname: string, balance: number): void {
    const user = {username, password, name, lastname, balance};
    localStorage.setItem(username, JSON.stringify(user));
  }

  getCurrentUsername(): string {
    const username = localStorage.getItem('isLoggedIn');
    if (username) {
      const user = JSON.parse(localStorage.getItem(username) || '{}');
      return user.username;
    }
    return '';
  }






}


