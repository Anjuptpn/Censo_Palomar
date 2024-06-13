import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { PigeonRegisterComponent } from './pages/user/pigeon-register/pigeon-register.component';

export const routes: Routes = [    
    {path: 'auth', loadChildren: () => import('./pages/auth/auth.routes')},
    {path: 'user', loadChildren: () => import('./pages/user/user.routes')},
    {path: '', component: HomeComponent}
];
