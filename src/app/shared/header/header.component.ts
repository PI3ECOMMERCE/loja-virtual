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
<a [routerLink]="['/home']" class="logo" aria-label="Página inicial">
  <img src="assets/images/logo.png" alt="Logo Loja Divina Casa" />
</a>
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
  nav, .navbar {
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 0.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    position: relative;
    z-index: 1000;
  }

  a, .nav-link {
    color: #555;
    text-decoration: none;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    padding: 0.5rem 0;
    position: relative;
  }

  a:hover, .nav-link:hover {
    color: #000;
    transform: translateY(-2px);
  }

  .logo {
    font-weight: bold;
    font-size: 1rem;
    color: #3f51b5;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    height: 100%;
  }

  .logo img {
    height: 50px;
    width: auto;
    max-height: 100%;
    transition: transform 0.3s ease;
  }

  .logo:hover img {
    transform: scale(1.05);
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  .nav-link.active-link {
    color: #3f51b5;
    font-weight: 500;
  }

  .nav-link.active-link::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 100%;
    height: 2px;
    background: #3f51b5;
    border-radius: 2px;
    transform: scaleX(0.2);
    transform-origin: center;
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .nav-link.active-link:hover::after {
    transform: scaleX(1);
  }

  .active-link mat-icon {
    color: inherit;
  }

  .admin {
    color: #673ab7;
    background: rgba(103, 58, 183, 0.1);
    border-radius: 20px;
    padding: 0.5rem 1rem !important;
  }

  .admin:hover {
    color: #5e35b1 !important;
    background: rgba(103, 58, 183, 0.15);
  }

  .logout {
    color: #ff3d00;
    background: rgba(255, 61, 0, 0.1);
    border-radius: 20px;
    padding: 0.5rem 1rem !important;
  }

  .logout:hover {
    color: #c62828 !important;
    cursor: pointer;
    background: rgba(255, 61, 0, 0.15);
  }

  /* Responsividade */
  @media (max-width: 768px) {
    .navbar {
      padding: 0.5rem 1rem;
      height: 60px;
    }
    
    .logo img {
      height: 40px;
    }
    
    .nav-links {
      gap: 1rem;
    }
    
    .nav-link span {
      display: none;
    }
    
    .nav-link mat-icon {
      margin-right: 0;
      font-size: 1.5rem;
    }
  }
`]
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}
}