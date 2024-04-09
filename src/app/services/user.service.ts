import {Injectable} from '@angular/core';
import {UserInterface} from "../interface/user";
import {AuthService} from "./auth-service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private auth:AuthService) {
  }

  getUsers(): UserInterface[] {
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');
    const currentUsername = this.auth.getCurrentUsername();
    const users: UserInterface[] = Object.values(usersData) as UserInterface[];
    return users.filter((user) => user.username != currentUsername);
  }

  getUserByUsername(username: string): UserInterface | null {
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    const userData = usersData[username];
    return userData ? userData as UserInterface : null;
  }

}
