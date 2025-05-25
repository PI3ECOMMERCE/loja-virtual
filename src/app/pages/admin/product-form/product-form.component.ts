import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc } from 'firebase/firestore';


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ isEditMode ? 'Editar' : 'Novo' }} Produto</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome</mat-label>
            <input matInput formControlName="name">
            <mat-error *ngIf="productForm.get('name')?.hasError('required')">
              Nome é obrigatório
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Preço</mat-label>
            <input matInput type="number" formControlName="price" step="0.01">
            <mat-error *ngIf="productForm.get('price')?.hasError('required')">
              Preço é obrigatório
            </mat-error>
            <mat-error *ngIf="productForm.get('price')?.hasError('min')">
              Preço mínimo: R$ 0.01
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descrição</mat-label>
            <textarea matInput formControlName="description" rows="3"></textarea>
            <mat-error *ngIf="productForm.get('description')?.hasError('required')">
              Descrição é obrigatória
            </mat-error>
          </mat-form-field>

          <div class="actions">
            <button mat-raised-button type="button" (click)="onCancel()">Cancelar</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="productForm.invalid">
              {{ isEditMode ? 'Atualizar' : 'Salvar' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card { max-width: 600px; margin: 2rem auto; padding: 1rem; }
    .full-width { width: 100%; margin-bottom: 1rem; }
    .actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
    mat-error { font-size: 12px; }
  `]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private firestore: Firestore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    if (this.isEditMode && this.productId) {
      const productRef = doc(this.firestore, 'products', this.productId);
      const productSnap = await getDoc(productRef);
      
      if (productSnap.exists()) {
        this.productForm.patchValue(productSnap.data());
      }
    }
  }

  async onSubmit() {
    if (this.productForm.invalid) return;

    const productData = this.productForm.value;

    try {
      if (this.isEditMode && this.productId) {
        await this.productService.updateProduct(this.productId, productData);
      } else {
        await this.productService.addProduct(productData);
      }
      this.router.navigate(['/admin/products']);
    } catch (error) {
      console.error('Erro:', error);
      alert('Ocorreu um erro. Tente novamente.');
    }
  }

  onCancel() {
  this.router.navigate(['/admin/products']); // ↽-- Navegação absoluta garantida
  }
}
