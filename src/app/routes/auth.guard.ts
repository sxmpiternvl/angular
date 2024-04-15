import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      return true;
    } else {
      return this.router.createUrlTree(['/']);
    }
  }
}
