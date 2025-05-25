import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials-section',
  imports: [CommonModule],
  template: `
    <section class="testimonials-section">
    <section class="testimonials-section">
      <div class="values-section">
        <h2 class="section-title">Nossos Valores</h2>
        <div class="values-grid">
          <div class="value-item" *ngFor="let valor of valores">
            <div class="value-icon">
              <i [class]="valor.icone"></i>
            </div>
            <h3>{{ valor.titulo }}</h3>
            <p>{{ valor.descricao }}</p>
          </div>
        </div>
      </div>


  <section class="testimonial-carousel">
    <h2>O que nossos clientes dizem</h2>
  
  <div class="carousel-wrapper">
    <button class="carousel-btn" (click)="prevTestimonial()" aria-label="Depoimento anterior">‹</button>
    
    <div class="testimonial-card" [class.active]="true">
      <p>{{ depoimentos[currentTestimonial].texto }}</p>
      <strong>{{ depoimentos[currentTestimonial].autor }}</strong>
    </div>
    
    <button class="carousel-btn" (click)="nextTestimonial()" aria-label="Próximo depoimento">›</button>
  </div>
  
  <div class="carousel-indicators">
    <span *ngFor="let item of depoimentos; let i = index" 
          [class.active]="i === currentTestimonial"
          (click)="currentTestimonial = i"></span>
  </div>
</section>

  `,
  styles: [`
    .values-section {
      padding: 4rem 2rem;
      background: #f9f9f9;
      border-top: 1px solid rgba(0,0,0,0.05);
      text-align: center;
    }

    .section-title {
      font-size: 2.2rem;
      color: #2c3e50;
      margin-bottom: 1.5rem;
      position: relative;
      display: inline-block;
    }

    .section-title::after {
      content: '';
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -10px;
      width: 60px;
      height: 3px;
      background: #3f51b5;
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      max-width: 1200px;
      margin: 2rem auto 0;
    }

    .value-item {
      background: white;
      padding: 2rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.03);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      text-align: center;
    }

    .value-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.08);
    }

    .value-icon i {
      font-size: 2.5rem;
      color: #3f51b5;
      margin-bottom: 1.5rem;
      transition: transform 0.3s ease;
    }

    .value-item:hover .value-icon i {
      transform: scale(1.1);
    }

    .value-item h3 {
      color: #2c3e50;
      margin-bottom: 0.8rem;
      font-size: 1.3rem;
    }

    .value-item p {
      color: #666;
      font-size: 0.95rem;
      line-height: 1.6;
      margin: 0;
    }

.testimonial-carousel {
  text-align: center;
  margin: 5rem auto;
  max-width: 1200px;
  padding: 0 1.5rem;
}

.carousel-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 2.5rem;
  position: relative;
}

.testimonial-card {
  width: 100%;
  max-width: 600px;
  background: #fff;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.testimonial-card::before {
  content: '"';
  position: absolute;
  top: 1.5rem;
  left: 2rem;
  font-size: 4rem;
  color: #3f51b5;
  opacity: 0.1;
  font-family: serif;
  line-height: 1;
}

.testimonial-card p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #444;
  font-style: italic;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.testimonial-card strong {
  display: block;
  font-size: 1rem;
  color: #3f51b5;
  font-weight: 600;
  margin-top: 1rem;
}

.carousel-btn {
  background: #f8f9fa;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #3f51b5;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.carousel-btn:hover {
  background: #3f51b5;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(63, 81, 181, 0.3);
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 2rem;
}

.carousel-indicators span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicators span.active {
  background: #3f51b5;
  transform: scale(1.2);
}

/* Animação de transição */
.testimonial-card {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.testimonial-card.active {
  opacity: 1;
  transform: translateY(0);
}

/* Responsivo */
@media (max-width: 768px) {
  .carousel-wrapper {
    gap: 1rem;
  }
  
  .testimonial-card {
    padding: 1.5rem;
  }
  
  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}
`]

})
export class TestimonialsSectionComponent {
  valores = [
    {
      icone: 'fas fa-shield-alt',
      titulo: 'Segurança',
      descricao: 'Garantimos a proteção dos seus dados'
    },
    {
      icone: 'fas fa-handshake',
      titulo: 'Confiança',
      descricao: 'Relações construídas com transparência'
    },
    {
      icone: 'fas fa-award',
      titulo: 'Qualidade',
      descricao: 'Produtos selecionados com excelência'
    },
    {
      icone: 'fas fa-headset',
      titulo: 'Suporte',
      descricao: 'Estamos aqui para te ajudar'
    }
  ];

  depoimentos = [
    {
      texto: "Adorei o atendimento e a qualidade dos produtos! Com certeza vou comprar novamente.",
      autor: "Maria Silva",
    },
    {
      texto: "Entrega super rápida e o produto veio exatamente como na descrição. Recomendo!",
      autor: "João Santos",
    },
    {
      texto: "Fiquei impressionada com a atenção ao cliente. Resolveram meu problema rapidamente.",
      autor: "Ana Oliveira",
    },
  ];
  currentTestimonial = 0;

  nextTestimonial() {
    this.currentTestimonial = (this.currentTestimonial + 1) % this.depoimentos.length;
  }

  prevTestimonial() {
    this.currentTestimonial = (this.currentTestimonial - 1 + this.depoimentos.length) % this.depoimentos.length;
  }

}