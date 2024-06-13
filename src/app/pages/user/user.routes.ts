import { Routes } from "@angular/router";

export const routes: Routes = [    
    {path: 'pigeon-register', 
        loadComponent: () => import('./pigeon-register/pigeon-register.component').then(
            (m)=> m.PigeonRegisterComponent)
    },
    {path: 'pigeon-list', 
        loadComponent: () => import('./pigeon-list/pigeon-list.component').then(
            (m) => m.PigeonListComponent)
    },
    {path: '', 
        loadComponent: () => import('./profile/profile.component').then(
            (m)=> m.ProfileComponent)
    }    
] 

export default routes;