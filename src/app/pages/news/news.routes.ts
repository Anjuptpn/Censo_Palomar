import { Routes } from "@angular/router";

export const routes: Routes = [    
    {path: 'read/:id', 
        loadComponent: () => import('./view-news/view-news.component').then(
            (m)=> m.ViewNewsComponent)
    },
    {path: '', 
        loadComponent: () => import('./list-news/list-news.component').then(
            (m) => m.ListNewsComponent)
    },   
]

export default routes;