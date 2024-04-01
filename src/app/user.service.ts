import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {
  }

  getUsers(): { username: string; balance: number; name: string; income: number; outgoing: number }[] {
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    const usersList: { username: string; balance: number; name: string; income: number; outgoing: number }[] = [];
    Object.keys(usersData).forEach((key) => {
      const userData = usersData[key];
      const username = userData.username;
      const balance = userData.balance;
      const name = userData.name;
      const income = userData.income;
      const outgoing = userData.outgoing;
      usersList.push({username, balance, name, income, outgoing});
    });
    console.log(usersList);
    return usersList;
  }

  getUserByUsername(username: string): { username: string; balance: number; name: string; income: number; outgoing: number; uid:string } | null {
    const usersData = JSON.parse(localStorage.getItem('users') ?? '{}');
    const userData = usersData[username];
    if (userData) {
      const user = {
        uid: userData.uid,
        username: userData.username,
        balance: userData.balance,
        name: userData.name,
        income: userData.income,
        outgoing: userData.outgoing
      };
      return user;
    }
    return null;

  }

}
