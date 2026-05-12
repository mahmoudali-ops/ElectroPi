import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order-service.service';
import { ICustomerOrder } from '../../../core/interfaces/iproduct';
import { TranslatedPipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatedPipe],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css'
})
export class OrdersListComponent implements OnInit {
  private readonly ordersApi = inject(OrderService);

  readonly orders = signal<ICustomerOrder[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    const userId = localStorage.getItem('userId') ?? '';
    if (!userId) {
      this.loading.set(false);
      return;
    }
    this.ordersApi.getUserOrders(userId).subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : res?.data;
        this.orders.set(Array.isArray(list) ? list : []);
        this.loading.set(false);
      },
      error: () => {
        this.orders.set([]);
        this.loading.set(false);
      }
    });
  }
}
