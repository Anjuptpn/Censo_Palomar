import { Routes } from "@angular/router";

export const routes: Routes = [    
    {path: 'email-verification', 
        loadComponent: () => import('./email-verification/email-verification.component').then(
            (m) => m.EmailVerificationComponent
        )
    },
    {path: 'recovery-password', 
        loadComponent: () => import('./recovery-password/recovery-password.component').then(
            (m)=> m.RecoveryPasswordComponent)
    },
    {path: 'login', 
        loadComponent: () => import('./login/login.component').then((m)=> m.LoginComponent)
    },
    {path: 'sign-up', 
        loadComponent: () => import('./signup/signup.component').then((m)=> m.SignupComponent)
    },
    {path: '', 
        loadComponent: () => import('./login/login.component').then((m)=> m.LoginComponent)
    }    
]

export default routes;