import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
  set(key: string, value: string){
    localStorage.setItem(key,value);
  }
  get(key: string){
    localStorage.getItem(key);
    return key;
  }
  remove(key: string){
    localStorage.removeItem(key);
  }

}
