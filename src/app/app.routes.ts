import { Routes } from '@angular/router';
import {BalancesComponent} from "./balances/balances.component";
import {OperationsComponent} from "./operations/operations.component";
import {LoginComponent} from "./login/login.component";
import {RegistrationComponent} from "./registration/registration.component";
import {AllUsersComponent} from "./all-users/all-users.component";

export const routes: Routes = [
            {
                path: '', component: LoginComponent
            },
            {
                path: 'login', component: LoginComponent
            },
            {
                path: 'registration', component: RegistrationComponent
            },
            {
                path: 'operations', component: OperationsComponent
            },
            {
                path: 'balances', component: BalancesComponent
            },
            {
                path: 'allUsers', component: AllUsersComponent
            },
];

    export class AppModule { }

