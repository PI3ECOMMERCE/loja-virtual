import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-hero-banner',
  template: `
    <section class="hero" style="background:#9FC131; padding: 4rem; text-align: center; color: #fff;">
      <h1>{{ titulo }}</h1>
      <p>{{ subtitulo }}</p>
    </section>
  `
})
export class HeroBannerComponent {
  titulo = "Minha Vitrine Virtual";
  subtitulo = "Produtos selecionados para você";
}
