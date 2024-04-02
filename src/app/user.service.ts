import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {
  }

  getUsers(): { username: string; balance: number; name: string; income: number; outgoing: number; currentBalance: number }[] {
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    const usersList: { username: string; balance: number; name: string; income: number; outgoing: number; currentBalance: number }[] = [];
    Object.keys(usersData).forEach((key) => {
      const userData = usersData[key];
      const username = userData.username;
      const balance = userData.balance;
      const name = userData.name;
      const income = userData.income;
      const outgoing = userData.outgoing;
      const currentBalance = userData.currentBalance;
      usersList.push({username, balance, name, income, outgoing, currentBalance});
    });
    console.log(usersList);
    return usersList;
  }

  getUserByUsername(username: string): { username: string; balance: number; name: string; income: number; outgoing: number; uid:string, currentBalance: number } | null {
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    const userData = usersData[username];
    if (userData) {
      return {
        uid: userData.uid,
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

  getCurrentBalance(balance: number, income: number, outgoing: number){
    return balance - outgoing + income;
  }



}
