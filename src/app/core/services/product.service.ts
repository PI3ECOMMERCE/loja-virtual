import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject, shareReplay } from 'rxjs';
import { Product } from '../models/product.model';
import { serverTimestamp } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$: Observable<Product[]>;
  
  constructor(private firestore: Firestore) {
    // Cria um observable que emite sempre que os dados mudam no Firestore
    const productsQuery = query(collection(this.firestore, 'products'), orderBy('createdAt', 'desc'));
    const firestoreProducts$ = collectionData(productsQuery, { idField: 'id' }) as Observable<Product[]>;
    
    // Conecta o observable do Firestore ao BehaviorSubject
    firestoreProducts$.subscribe(products => {
      this.productsSubject.next(products);
    });
    
    // Cria um observable público com shareReplay para evitar múltiplas subscrições
    this.products$ = this.productsSubject.asObservable().pipe(
      shareReplay(1)
    );
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const productsRef = collection(this.firestore, 'products');
    await addDoc(productsRef, {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()  
    });
    
    // O BehaviorSubject será atualizado automaticamente pelo subscription acima
  }

  async updateProduct(id: string, product: Partial<Product>) {
    const productRef = doc(this.firestore, `products/${id}`);
    await updateDoc(productRef, {
      ...product,
      updatedAt: serverTimestamp()
    });
    
  }

  async deleteProduct(id: string) {
    const productRef = doc(this.firestore, `products/${id}`);
    await deleteDoc(productRef);
   
  }
}
