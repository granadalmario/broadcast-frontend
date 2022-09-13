import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
//const empleadosModule = () => import('./empleados/empleados.module').then(x => x.EmpleadosModule);
//const citasModule = () => import('./citas/citas.module').then(x => x.CitasModule);
const playModule = () => import('./play/play.module').then(x => x.PlayModule);


const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
   // { path: 'empleados', loadChildren: empleadosModule, canActivate: [AuthGuard] },
   // { path: 'citas', loadChildren: citasModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },
   { path: 'play', loadChildren: playModule, canActivate: [AuthGuard] },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }