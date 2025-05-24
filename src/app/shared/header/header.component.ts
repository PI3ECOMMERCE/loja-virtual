import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule,
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <nav class="navbar">
      <a [routerLink]="['/']" class="logo">Vitrine</a>
      <div class="nav-links">
        <!-- Links sempre visíveis -->
        <a [routerLink]="['/']" 
           [routerLinkActive]="['active-link']" 
           [routerLinkActiveOptions]="{exact: true}" 
           class="nav-link">
          <mat-icon>home</mat-icon>
          <span>Home</span>
        </a>
        <a [routerLink]="['/produtos']" 
           [routerLinkActive]="['active-link']" 
           class="nav-link">
          <mat-icon>storefront</mat-icon>
          <span>Produtos</span>
        </a>

        <!-- Botão de Painel Admin (visível apenas quando logado) -->
        <a *ngIf="authService.isAuthenticated()"
           [routerLink]="['/admin']" 
           [routerLinkActive]="['active-link']" 
           class="nav-link admin">
          <mat-icon>admin_panel_settings</mat-icon>
          <span>Painel</span>
        </a>

        <!-- Login/Sair condicionais -->
        <ng-container *ngIf="!authService.isAuthenticated(); else loggedIn">
          <a [routerLink]="['/login']" 
             [routerLinkActive]="['active-link']" 
             class="nav-link">
            <mat-icon>login</mat-icon>
            <span>Login</span>
          </a>
        </ng-container>

        <ng-template #loggedIn>
          <a (click)="authService.logout()" class="nav-link logout">
            <mat-icon>logout</mat-icon>
            <span>Sair</span>
          </a>
        </ng-template>
      </div>
    </nav>
  `,
  styles: [`
    nav {
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-links {
      display: flex;
      gap: 1.5rem;
    }
    a {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }
    a:hover {
      color: #3f51b5;
    }
    .logo {
      font-weight: bold;
      color: #3f51b5;
      font-size: 1.2rem;
    }
    .admin {
      color: #673ab7;
    }
    .admin:hover {
      color: #5e35b1 !important;
    }
    .logout {
      color: #ff3d00;
    }
    .logout:hover {
      color: #c62828 !important;
      cursor: pointer;
    }
    .active-link {
      color: #3f51b5;
      position: relative;
    }
    .active-link::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background: #3f51b5;
      border-radius: 2px;
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .active-link:hover::after {
      width: 100%;
    }
  `]
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}
}