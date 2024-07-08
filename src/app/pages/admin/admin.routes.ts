import { Routes } from "@angular/router";

export const routes: Routes = [    
    {path: 'write-news', 
        loadComponent: () => import('./news/write-news/write-news.component').then(
            (m) => m.WriteNewsComponent)
    },
    {path: 'update-news/:id', 
        loadComponent: () => import('./news/update-news/update-news.component').then(
            (m)=> m.UpdateNewsComponent)
    },
    {path: 'list-users', 
        loadComponent: () => import('./list-users/list-users.component').then(
            (m)=> m.ListUsersComponent)
    }
    ,
    {path: 'panel', 
        loadComponent: () => import('./panel/panel.component').then(
            (m)=> m.PanelComponent)
    },
    {path: '', 
        loadComponent: () => import('./news/update-news/update-news.component').then(
            (m)=> m.UpdateNewsComponent)
    }    
]

export default routes;