import {Injectable} from '@angular/core';
import {UserInterface} from "../interface/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {
  }

  getUsers(): {
    username: string;
    balance: number;
    name: string;
    income: number;
    outgoing: number;
    currentBalance: number;
    uid: string;
    password: string
  }[] {
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    const usersList: UserInterface[] = [];
    Object.keys(usersData).forEach((key) => {
      const userData = usersData[key];
      const username = userData.username;
      const balance = userData.balance;
      const name = userData.name;
      const income = userData.income;
      const outgoing = userData.outgoing;
      const currentBalance = userData.currentBalance;
      const password = userData.password;
      const uid = userData.uid;
      usersList.push({username, balance, name, income, outgoing, currentBalance, password, uid});
    });
    return usersList;
  }

  getUserByUsername(username: string): UserInterface | null {
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    const userData = usersData[username];
    if (userData) {
      return {
        uid: userData.uid,
        password: userData.password,
        username: userData.username,
        balance: userData.balance,
        name: userData.name,
        income: userData.income,
        outgoing: userData.outgoing,
        currentBalance: userData.currentBalance,
      };
    }
    return null;
  }

}
