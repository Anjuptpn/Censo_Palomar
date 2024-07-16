import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { loggedUserGuard } from './guards/logged-user.guard';
import { onlyAdminGuard } from './guards/only-admin.guard';
import { PolicyComponent } from './pages/policies/privacy-policy/policy.component';
import { CookiesComponent } from './pages/policies/cookies/cookies.component';
import { LegalNoticyComponent } from './pages/policies/legal-noticy/legal-noticy.component';

export const routes: Routes = [    
    {path: 'auth', loadChildren: () => import('./pages/auth/auth.routes')},
    {path: 'user', loadChildren: () => import('./pages/user/user.routes'), canActivate: [loggedUserGuard]},
    {path: 'admin', loadChildren: () => import('./pages/admin/admin.routes'), canActivate: [onlyAdminGuard, loggedUserGuard]},
    {path: 'news', loadChildren: () => import('./pages/news/news.routes')},
    {path: 'ads', loadChildren: () => import('./pages/ads/ads.routes')},
    {path: 'privacy-policy', component: PolicyComponent},
    {path: 'cookies-policy', component: CookiesComponent},
    {path: 'legal-notice', component: LegalNoticyComponent},
    {path: '', component: HomeComponent},
    {path: '**', component: HomeComponent}
];
