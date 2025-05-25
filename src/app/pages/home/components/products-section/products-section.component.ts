import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-products-section',
  template: `
    <section class="products-section">
  <h2>Novidades</h2>
  <div class="products-grid">
    <div class="product-card" *ngFor="let produto of produtos">
      <img 
        [src]="produto.imagem" 
        [alt]="produto.nome" 
        (error)="produto.imagem = 'assets/images/produto.jpg'"
        class="product-image"
      >
      <div class="product-info">
        <h3>{{ produto.nome }}</h3>
        <p class="price">{{ produto.preco | currency:'BRL' }}</p>
        <button 
          (click)="openExternalLink(produto.linkExterno)" 
          class="buy-button"
        >
          Comprar
        </button>
      </div>
    </div>
  </div>

  <div class="more-products-container">
    <a routerLink="/produtos" class="more-products-button">
      <span class="plus-icon">+</span>
      <span class="button-text">Ver todos os produtos</span>
    </a>
  </div>

  <div class="external-link-modal" *ngIf="showModal">
    <div class="modal-content">
      <h3>Você está saindo do site</h3>
      <p>Você será redirecionado para: <strong>{{ externalLink }}</strong></p>
      <div class="modal-actions">
        <button (click)="cancelRedirect()" class="cancel-button">Cancelar</button>
        <button (click)="confirmRedirect()" class="confirm-button">Continuar</button>
      </div>
    </div>
  </div>
</section>
  `,
  styles: [`
    .products-section {
      padding: 2rem;
      background: #f9f9f9;
      text-align: center;
    }
    .products-section h2 {
      font-size: 2rem;
      color: #2c3e50;
      margin: 1.7rem;
      position: relative;
      display: inline-block;
    }

        .products-section h2::after {
      content: '';
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -10px;
      width: 60px;
      height: 3px;
      background: #3f51b5;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  .product-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    border: 1px solid rgba(0, 0, 0, 0.08);
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      }
    }
  .product-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
    }
    .product-info {
      padding: 1rem;
    }
    .price {
      color: #3f51b5;
      font-weight: bold;
      margin: 0.5rem 0;
    }

.buy-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #3f51b5;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  width: 100%;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
  position: relative;
}

.buy-button::after {
  content: "↗";
  margin-left: 0.5rem;
  font-size: 0.9em;
  opacity: 0.7;
  transition: transform 0.2s;
}

.buy-button:hover::after {
  transform: translate(2px, -2px);
}


.more-products-container {
  text-align: center;
  margin-top: 3rem;
  padding: 1rem;
}

.more-products-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #3f51b5;
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(63, 81, 181, 0.2);
}

.more-products-button:hover {
  background: #303f9f;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(63, 81, 181, 0.3);
}

.plus-icon {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
}

.button-text {
  font-size: 1rem;
}


.external-link-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.modal-content h3 {
  color: #3f51b5;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.confirm-button {
  background: #3f51b5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.confirm-button:hover {
  background: #303f9f;
}

.cancel-button {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-button:hover {
  background: #e0e0e0;
  }
`]
})
export class ProductsSectionComponent {
  produtos = [
    {
      nome: "Aparelho de Jantar",
      preco: 599.90,
      imagem: "assets/images/aparelho-jantar.jpg",
      linkExterno: "https://mercadolivre.com/"
    },
    {
      nome: "Kit de Potes Herméticos",
      preco: 159.90,
      imagem: "assets/images/kit5-pote-hermetico.jpg",
      linkExterno: "https://mercadolivre.com/"
    },
    {
      nome: "Aparelho de Jantar",
      preco: 599.90,
      imagem: "assets/images/aparelho-jantar.jpg",
      linkExterno: "https://mercadolivre.com/"
    },
    {
      nome: "Kit de Potes Herméticos",
      preco: 159.90,
      imagem: "assets/images/kit5-pote-hermetico.jpg",
      linkExterno: "https://mercadolivre.com/"
    }
  ];

  showModal = false;
  externalLink = '';
  externalUrl = '';

  openExternalLink(link: string, event?: MouseEvent) {
    if (event) event.preventDefault();
    this.externalLink = this.getDomainName(link);
    this.externalUrl = link;
    this.showModal = true;
  }

  confirmRedirect() {
    window.open(this.externalUrl, '_blank');
    this.showModal = false;
  }

  cancelRedirect() {
    this.showModal = false;
  }

  private getDomainName(url: string): string {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch {
      return url;
    }
  }
}
