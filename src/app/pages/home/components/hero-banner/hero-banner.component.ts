import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-hero-banner',
  template: `
    <section class="hero" style="background:#5e6d48; padding: 1.3rem; text-align: center; color: #fff;">
            <h1>{{ titulo }}</h1>
      <p>{{ subtitulo }}</p>
      <img src="assets/images/banner2.png" alt="Logo da Divina Casa" style="width: 480px; margin-top: 2rem; ">

    </section>
  `
})
export class HeroBannerComponent {
titulo = "Bem-vinda à Divina Casa";
subtitulo = "Tudo para seu lar com o cuidado que você merece";
}
