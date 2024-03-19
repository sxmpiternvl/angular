import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {
  }

  getAllUsers(): { username: string; balance: number }[] {
    const usersBalances: { username: string; balance: number }[] = [];
    for (let i = 1; i < localStorage.length; i++) {
      const user = localStorage.key(i);
      if (user) {
        const userData = localStorage.getItem(user);
        if (userData) {
          try {
            const user = JSON.parse(userData);
            usersBalances.push({username: user.username, balance: user.balance});
          } catch (error) {

          }
        }
      }
    }
    return usersBalances;
  }

  getUsersList(): { username: string; name: string }[] {
    const usersList: { username: string; name: string }[] = [];
    for (let i = 1; i < localStorage.length; i++) {
      const user = localStorage.key(i);
      if (user) {
        const userData = localStorage.getItem(user);
        if (userData) {
          try {
            const user = JSON.parse(userData);
            usersList.push({username: user.username, name: user.name});
          } catch (error) {

          }
        }
      }
    }
    return usersList;
  }
}
