import { Routes } from "@angular/router";
import { authGuard } from "../../guards/auth.guard";
import { notLoggedGuard } from "../../guards/not-logged.guard";

export const routes: Routes = [    
    {path: 'email-verification', 
        loadComponent: () => import('./email-verification/email-verification.component').then(
            (m) => m.EmailVerificationComponent
        ), canActivate: [authGuard]
    },
    {path: 'recovery-password', 
        loadComponent: () => import('./recovery-password/recovery-password.component').then(
            (m)=> m.RecoveryPasswordComponent), canActivate: [notLoggedGuard]
    },
    {path: 'login', 
        loadComponent: () => import('./login/login.component').then((m)=> m.LoginComponent),
        canActivate: [notLoggedGuard]
    },
    {path: 'sign-up', 
        loadComponent: () => import('./signup/signup.component').then((m)=> m.SignupComponent),
        canActivate: [notLoggedGuard]
    },
    {path: '', 
        loadComponent: () => import('./login/login.component').then((m)=> m.LoginComponent),
        canActivate: [notLoggedGuard]
    }    
]

export default routes;