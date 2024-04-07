import {Routes} from '@angular/router';
import {BalancesComponent} from "../Components/balances/balances.component";
import {OperationsComponent} from "../Components/operations/operations.component";
import {LoginComponent} from "../Components/login/login.component";
import {RegistrationComponent} from "../Components/registration/registration.component";
import {AllUsersComponent} from "../Components/all-users/all-users.component";
import {authGuard} from "../auth.guard";

export const routes: Routes = [
  {
    path: '', component: LoginComponent,
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'registration', component: RegistrationComponent
  },
  {
    path: 'operations', component: OperationsComponent, canActivate:[authGuard]
  },
  {
    path: 'balances', component: BalancesComponent
  },
  {
    path: 'allUsers', component: AllUsersComponent
  },
];

export class AppModule {
}

