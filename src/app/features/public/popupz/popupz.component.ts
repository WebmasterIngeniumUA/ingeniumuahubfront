import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { CartService } from 'src/app/core/services/shop/cart/cart.service';
import { EventItemDetailI } from 'src/app/shared/models/items/events';
import { IItem } from 'src/app/shared/models/items/IItem';
import { IProductItem } from 'src/app/shared/models/items/products/products';
import { apiEnviroment } from 'src/enviroments';

@Component({
  selector: 'app-page',
  templateUrl: './popupz.component.html',
  styleUrls: ['./popupz.component.scss']
})
export class PopupzComponent {
  category: 'food' | 'drinks' | 'snacks' = 'food';
  totalProducts: number = 0;
  products$: Observable<IProductItem[]> = of([]);
  event: EventItemDetailI = {} as EventItemDetailI;

  constructor(private httpClient: HttpClient, private cartService: CartService, private toastr: ToastrService) {}

  ngOnInit() {
    this.updateProductTotal();
    this.getProducts();
    this.httpClient.get<EventItemDetailI>(apiEnviroment.apiUrl + "popup/event").subscribe((item) => {
      this.event = item;
    });
  }

  setCategory(category: 'food' | 'drinks' | 'snacks'): void {
    this.category = category;
    this.getProducts();
  }

  getProducts(): void {
    this.products$ = this.httpClient.get<IProductItem[]>(apiEnviroment.apiUrl + "popup/" + this.category);
  }

  addProduct(product: IProductItem): void {
    // Check if product has an option
    if (product.product_meta.popupz_opties) {
      // Get the option using HTML name
      const option = document.querySelector(`input[name="${product.product_blueprint_id}_saus"]:checked`);
      if (option) {
        product.product_meta.popupz_opties = option.getAttribute("value") || "geen";
      }
    }

    try {

      this.cartService.setProductCount(this.event.item, product, this.cartService.getProductCount(this.event.item, product) + 1);
      this.toastr.success(product.name, 'Product toegevoegd aan winkelmandje');
    } catch (e) {
      console.error(e);
      this.toastr.error('Bestel aan de kassa als je problemen blijft ondervinden', 'Oei! Er is iets misgegaan.');
    }

    // Absolutly disgusting, but it's neccesary to update the total count because the cart is not observable
    this.updateProductTotal();
  }

  updateProductTotal(): void {
    this.totalProducts = this.cartService.getProductsCount();
  }
}