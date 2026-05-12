import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order-service.service';
import { IOrder } from '../../core/interfaces/iproduct';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  private readonly api = inject(OrderService);
  readonly orders = signal<IOrder[]>([]);
  readonly loading = signal(true);
  readonly feedback = signal<string | null>(null);

  readonly statuses = ['Pending', 'Approved', 'Shipped', 'Completed', 'Cancelled'];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.api.getAllOrdersAdmin().subscribe({
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

  updateStatus(id: number, status: string): void {
    this.feedback.set(null);
    this.api.updateOrderStatus(id, status).subscribe({
      next: () => {
        this.feedback.set('Order status updated.');
        this.loadOrders();
      },
      error: () => {
        this.feedback.set('Unable to update order status.');
      }
    });
  }

  approveOrder(order: IOrder): void {
    if (order.status === 'Approved') {
      this.feedback.set('Order is already approved.');
      return;
    }
    this.updateStatus(order.id, 'Approved');
  }

  deleteOrder(id: number): void {
    if (!confirm('Delete this order?')) {
      return;
    }

    this.api.deleteOrder(id).subscribe({
      next: () => {
        this.feedback.set('Order deleted successfully.');
        this.loadOrders();
      },
      error: () => {
        this.feedback.set('Unable to delete order.');
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Approved':
        return 'status-approved';
      case 'Shipped':
        return 'status-shipped';
      case 'Completed':
        return 'status-completed';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }
}
