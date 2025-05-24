import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="site-footer">
      <div class="footer-container">
        <!-- Seção Sobre -->
        <div class="footer-section">
          <h3>Sobre Nós</h3>
          <p>Marca ou descrição aqui. <br> Lorem ipsum dolor sit amet, <br> adipiscing elit.</p>
          <div class="social-links">
            <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>

        <!-- Seção Links Rápidos -->
        <div class="footer-section">
          <h3>Links Rápidos</h3>
          <ul>
            <li><a routerLink="/">Home</a></li>
            <li><a routerLink="/produtos">Produtos</a></li>
            <li><a routerLink="/sobre">Sobre</a></li>
            <li><a routerLink="/contato">Contato</a></li>
            <li><a>Instagram</a></li>
          </ul>
        </div>

        <!-- Seção de Contatos -->
        <div class="footer-section">
          <h3>Contato</h3>
          <ul class="contact-info">
            <li><i class="fas fa-map-marker-alt"></i> Rua Exemplo, 123 - Cidade/SP</li>
            <li><i class="fas fa-phone"></i> (19) 9999-9999</li>
            <li><i class="fas fa-envelope"></i> contato&#64;empresa.com</li>
            <li><i class="fab fa-whatsapp"></i> (19) 99999-9999</li>
          </ul>
        </div>

        <!-- Seção Newsletter -->
        <div class="footer-section">
          <h3>Newsletter</h3>
          <p>Assine para receber nossas promoções</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Seu melhor email">
            <button type="submit">Assinar</button>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Vitrine Virtual. Todos os direitos reservados.</p>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background-color: #2c3e50;
      color: #ecf0f1;
      padding: 4rem 0 0;
      font-size: 0.9rem;
    }
    
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 3rem;
    }
    
    .footer-section {
      margin-bottom: 2rem;
    }
    
    .footer-section h3 {
      color: #fff;
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      position: relative;
      padding-bottom: 0.5rem;
    }
    
    .footer-section h3::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 40px;
      height: 2px;
      background: #3f51b5;
    }
    
    .footer-section p {
      margin-bottom: 1rem;
      line-height: 1.6;
    }
    
    .footer-section ul {
      list-style: none;
      padding: 0;
    }
    
    .footer-section ul li {
      margin-bottom: 0.8rem;
    }
    
    .footer-section ul li a {
      color: #bdc3c7;
      text-decoration: none;
      transition: color 0.3s;
    }
    
    .footer-section ul li a:hover {
      color: #3f51b5;
    }
    
    .contact-info li {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 1rem;
    }
    
    .contact-info i {
      color: #3f51b5;
      width: 20px;
      text-align: center;
    }
    
    .social-links {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .social-links a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      color: #fff;
      transition: all 0.3s;
    }
    
    .social-links a:hover {
      background: #3f51b5;
      transform: translateY(-3px);
    }
    
    .newsletter-form {
      display: flex;
      margin-top: 1rem;
    }
    
    .newsletter-form input {
      flex: 1;
      padding: 0.6rem;
      border: none;
      border-radius: 4px 0 0 4px;
    }
    
    .newsletter-form button {
      background: #3f51b5;
      color: white;
      border: none;
      padding: 0 1rem;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    .newsletter-form button:hover {
      background: #303f9f;
    }
    
    .footer-bottom {
      background: rgba(0,0,0,0.2);
      padding: 1.5rem;
      text-align: center;
      margin-top: 3rem;
    }
    
    @media (max-width: 768px) {
      .footer-container {
        grid-template-columns: 1fr 1fr;
      }
      
      .newsletter-form {
        flex-direction: column;
      }
      
      .newsletter-form input,
      .newsletter-form button {
        border-radius: 4px;
        width: 100%;
      }
      
      .newsletter-form button {
        margin-top: 0.5rem;
      }
    }
    
    @media (max-width: 480px) {
      .footer-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}