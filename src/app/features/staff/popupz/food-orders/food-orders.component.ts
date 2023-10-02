import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, mergeMap } from 'rxjs';
import { apiEnviroment } from 'src/enviroments';

@Component({
  selector: 'app-food-orders',
  templateUrl: './food-orders.component.html',
  styleUrls: ['./food-orders.component.css']
})
export class FoodOrdersComponent {
  constructor(private httpService: HttpClient) {}
  orders: any = [];

  ngOnInit() {
    interval(5000)
      .pipe(
          mergeMap(() => this.httpService.get<any>(apiEnviroment.apiUrl + "popup/cache/food_dashboard"))
      )
      .subscribe((data) => {
        this.orders = data;
      });
  }

  public removeOrder(order: any, index: number): void {
    // Remove item from database
    this.httpService.post(apiEnviroment.apiUrl + "popup/cache/delete/" + order.order_no, null).subscribe();

    // Remove item from orders
    this.orders.splice(index, 1);
  }

  public toggleOrderFinished(order: any, index: number): void {
    this.httpService.post(apiEnviroment.apiUrl + `popup/cache/update_status/${order.order_no}/${!this.orders[index].status}`, null).subscribe();

    // Update order status
    this.orders[index].status = !this.orders[index].status;
  }
}
