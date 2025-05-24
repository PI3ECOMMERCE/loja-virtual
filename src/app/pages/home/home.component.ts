import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importe TODOS os componentes usados no template
import { HeroBannerComponent } from './components/hero-banner/hero-banner.component';
import { ProductsSectionComponent } from './components/products-section/products-section.component';
import { TestimonialsSectionComponent } from './components/testimonials-section/testimonials-section.component';
import { AboutSectionComponent } from './components/about-section/about-section.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    HeroBannerComponent,
    ProductsSectionComponent,
    TestimonialsSectionComponent,
    AboutSectionComponent,
  ],
  template: `
    <app-hero-banner></app-hero-banner>
    <app-products-section></app-products-section>
    <app-testimonials-section></app-testimonials-section>
    <app-about-section></app-about-section>    
  `,
  styles: ``
})
export class HomeComponent { }