import { Routes } from "@angular/router";

export const routes: Routes = [    
    {path: 'pigeon-register', 
        loadComponent: () => import('./pigeons/pigeon-register/pigeon-register.component').then(
            (m)=> m.PigeonRegisterComponent)
    },
    {path: 'pigeon-list', 
        loadComponent: () => import('./pigeons/pigeon-list/pigeon-list.component').then(
            (m) => m.PigeonListComponent)
    },
    {path: 'edit-pigeon/:id', 
        loadComponent: () => import('./pigeons/edit-pigeon/edit-pigeon.component').then(
            (m) => m.EditPigeonComponent)
    },
    {path: 'pigeon-profile/:id', 
        loadComponent: () => import('./pigeons/pigeon-profile/pigeon-profile.component').then(
            (m) => m.PigeonProfileComponent)
    },
    {path: 'add-competition/:id', 
        loadComponent: () => import('./competitions/add-competition/add-competition.component').then(
            (m) => m.AddCompetitionComponent)
    },
    {path: 'edit-competition/:pigeonId/:competitionId', 
        loadComponent: () => import('./competitions/edit-competition/edit-competition.component').then(
            (m) => m.EditCompetitionComponent)
    },
    {path: 'view-competition/:pigeonId/:competitionId', 
        loadComponent: () => import('./competitions/view-competition/view-competition.component').then(
            (m) => m.ViewCompetitionComponent)
    },
    {path: 'family-tree/:id', 
        loadComponent: () => import('./familyTree/familiy-tree/familiy-tree.component').then(
            (m) => m.FamiliyTreeComponent)
    },
    {path: 'update-user', 
        loadComponent: () => import('./users/update-user/update-user.component').then(
            (m) => m.UpdateUserComponent)
    },
    {path: 'my-ads', 
        loadComponent: () => import('../ads/my-ads/my-ads.component').then(
            (m) => m.MyAdsComponent)
    },    
    {path: '', 
        loadComponent: () => import('./users/profile/profile.component').then(
            (m)=> m.ProfileComponent)
    }    
] 

export default routes;