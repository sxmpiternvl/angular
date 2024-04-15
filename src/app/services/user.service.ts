import {Injectable} from '@angular/core';
import {UserInterface} from "../interface/user";
import {AuthService} from "./auth-service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {
  }

  getUsers(): UserInterface[] {
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');
    return Object.values(usersData) as UserInterface[];
  }

  getUserByUsername(username: string): UserInterface | null {
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    const userData = usersData[username];
    return userData ? userData as UserInterface : null;
  }

}
