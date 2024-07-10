import { Routes } from "@angular/router";

export const routes: Routes = [    
    {path: 'publish-ads', 
        loadComponent: () => import('./publish-ads/publish-ads.component').then(
            (m)=> m.PublishAdsComponent)
    },
    {path: 'edit-ads/:id', 
        loadComponent: () => import('./edit-ads/edit-ads.component').then(
            (m) => m.EditAdsComponent)
    },
    {path: 'advertisement/:id', 
        loadComponent: () => import('./advertisement/advertisement.component').then(
            (m) => m.AdvertisementComponent)
    },
    {path: '', 
        loadComponent: () => import('./list-ads/list-ads.component').then(
            (m) => m.ListAdsComponent)
    },   
]

export default routes;