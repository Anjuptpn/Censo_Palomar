import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [    
    {path: 'auth', loadChildren: () => import('./pages/auth/auth.routes')},
    {path: 'user', loadChildren: () => import('./pages/user/user.routes')},
    {path: 'admin', loadChildren: () => import('./pages/admin/admin.routes')},
    {path: 'news', loadChildren: () => import('./pages/news/news.routes')},
    {path: '', component: HomeComponent}
];
