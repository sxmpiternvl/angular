import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import {BalancesComponent} from "./balances/balances.component";
import {OperationsComponent} from "./operations/operations.component";
import {LoginComponent} from "./login/login.component";
import {RegistrationComponent} from "./registration/registration.component";

export const routes: Routes = [
            {
                path: '', component: MainPageComponent
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
];

    export class AppModule { }

