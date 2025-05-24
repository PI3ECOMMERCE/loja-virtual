import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'produtos', 
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent) 
  },
  { 
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard],
    children: [
      { 
        path: 'products', 
        loadComponent: () => import('./pages/admin/product-list/product-list.component').then(m => m.ProductListComponent)
      },
      { 
        path: 'products/new', 
        loadComponent: () => import('./pages/admin/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      { 
        path: 'products/edit/:id', 
        loadComponent: () => import('./pages/admin/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  },

  { 
  path: 'registro', 
  loadComponent: () => import('./pages/registro/registro.component').then(m => m.RegisterComponent) 
},
  { path: '**', redirectTo: '' }
];