import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { loggedUserGuard } from './guards/logged-user.guard';
import { onlyAdminGuard } from './guards/only-admin.guard';

export const routes: Routes = [    
    {path: 'auth', loadChildren: () => import('./pages/auth/auth.routes')},
    {path: 'user', loadChildren: () => import('./pages/user/user.routes'), canActivate: [loggedUserGuard]},
    {path: 'admin', loadChildren: () => import('./pages/admin/admin.routes'), canActivate: [onlyAdminGuard, loggedUserGuard]},
    {path: 'news', loadChildren: () => import('./pages/news/news.routes')},
    {path: '', component: HomeComponent},
    {path: '**', component: HomeComponent}
];
