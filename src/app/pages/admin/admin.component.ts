import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-container">
      <aside class="sidebar">
        <h2>Painel Admin</h2>
        <nav class="nav-links">
          <a [routerLink]="['/admin/products']" 
             [routerLinkActive]="['active']">Produtos</a>
          <a [routerLink]="['/home']" 
             [routerLinkActive]="['active']">Dashboard</a>
        </nav>
      </aside>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-container { 
      display: flex; 
      min-height: 100vh; 
    }
    
    .sidebar { 
      width: 250px; 
      background: #f5f5f5; 
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .nav-links a {
      display: block;
      padding: 0.5rem;
      text-decoration: none;
      color: inherit;
    }
    
    .nav-links a:hover {
      background-color: #e0e0e0;
    }
    
    .active { 
      font-weight: bold; 
      color: #3f51b5; 
      position: relative;
    }
    
    .active::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 3px;
      height: 100%;
      background-color: #3f51b5;
    }
    
    .content { 
      flex: 1; 
      padding: 2rem; 
      background-color: white;
    }
  `]
})
export class AdminComponent {}