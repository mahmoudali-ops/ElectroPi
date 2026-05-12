import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order-service.service';
import { IOrder } from '../../../core/interfaces/iproduct';
import { TranslatedPipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatedPipe],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ordersApi = inject(OrderService);

  readonly order = signal<IOrder | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.loading.set(false);
      return;
    }
    this.ordersApi.getOrderById(id).subscribe({
      next: (res: any) => {
        this.order.set((res?.data ?? res) as IOrder);
        this.loading.set(false);
      },
      error: () => {
        this.order.set(null);
        this.loading.set(false);
      }
    });
  }
}
