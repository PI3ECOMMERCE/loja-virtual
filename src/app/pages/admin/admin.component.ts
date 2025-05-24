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
        <nav>
          <a [routerLink]="['/admin/products']" 
          [routerLinkActive]="['active']">Produtos</a>
        </nav>
      </aside>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-container { display: flex; min-height: 100vh; }
    .sidebar { width: 250px; background: #f5f5f5; padding: 1rem; }
    .content { flex: 1; padding: 2rem; }
    .active { font-weight: bold; color: #3f51b5; }
  `]
})
export class AdminComponent {}