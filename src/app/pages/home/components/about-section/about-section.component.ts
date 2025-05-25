import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="about-section">
      <div class="about-container">
        <div class="about-content">
          <h2 class="section-title">Sobre Nós</h2>
          <p class="about-text">Nascemos da paixão por transformar casas em lares e refeições em memórias. 
            Na Divina Casa, cada peça é escolhida como quem prepara a mesa para os melhores momentos. 
            Somos mais que uma loja - somos seus parceiros na arte de viver bem, 
            do café da manhã aos jantares inesquecíveis.</p>
          
          <div class="highlights-grid">
            <div class="highlight-item" *ngFor="let item of destaques">
              <div class="highlight-icon">
                <i [class]="item.icone"></i>
              </div>
              <h3>{{ item.titulo }}</h3>
              <p>{{ item.descricao }}</p>
            </div>
          </div>
          
          <button class="cta-button">Saiba mais</button>
        </div>
        
        <div class="about-image">
          <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
               alt="Nossa equipe" class="team-photo">
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-section {
      padding: 4rem 2rem;
      background: #f9f9f9;
      border-top: 1px solid rgba(0,0,0,0.05);
    }
    
    .about-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
    }
    
    .section-title {
      font-size: 2.2rem;
      color: #2c3e50;
      margin-bottom: 1.5rem;
      position: relative;
    }
    
    .section-title::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -10px;
      width: 60px;
      height: 3px;
      background: #3f51b5;
    }
    
    .about-text {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #555;
      margin-bottom: 2rem;
    }
    
    .highlights-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin: 2rem 0;
    }
    
    .highlight-item {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.03);
      transition: transform 0.3s ease;
    }
    
    .highlight-item:hover {
      transform: translateY(-5px);
    }
    
    .highlight-icon i {
      font-size: 2rem;
      color: #3f51b5;
      margin-bottom: 1rem;
    }
    
    .highlight-item h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    .highlight-item p {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.5;
    }
    
    .cta-button {
      background: #3f51b5;
      color: white;
      font-weight: bold;
      border: none;
      padding: 0.8rem 2rem;
      border-radius: 50px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 10px rgba(63, 81, 181, 0.3);
    }
    
    .cta-button:hover {
      background: #303f9f;
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(63, 81, 181, 0.4);
    }
    
    .team-photo {
      width: 100%;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      transition: transform 0.5s ease;
    }
    
    @media (max-width: 768px) {
      .about-container {
        grid-template-columns: 1fr;
      }
      
      .highlights-grid {
        grid-template-columns: 1fr;
      }
      
      .about-image {
        order: -1;
      }
    }
  `]
})
export class AboutSectionComponent {
  destaques = [
    {
      icone: 'fas fa-users',
      titulo: '+500 Clientes',
      descricao: 'Atendidos com excelência'
    },
    {
      icone: 'fas fa-star',
      titulo: 'Qualidade',
      descricao: 'Produtos selecionados'
    },
    {
      icone: 'fas fa-truck',
      titulo: 'Entrega Rápida',
      descricao: 'Para toda região'
    },
    {
      icone: 'fas fa-medal',
      titulo: 'Garantia',
      descricao: 'De satisfação'
    }
  ];
}