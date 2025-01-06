export interface OrderStatus {
  width: string;
  text: string;
  class: string;
}

export interface OrderStatusMap {
  [key: string]: OrderStatus;
}

export interface OrderItem {
  book_id: number;
  title: string;
  price: number;
  quantity: number;

  image_url: string;

}

export interface Order {
  id?: number;
  order_id: number;
  user_id: number;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  payment_method: string;
  order_notes: string;
  items: OrderItem[];
  total_amount: number;
  status: string;

  created_at: string;
}

export interface CreateOrderDTO extends Omit<Order, 'id' | 'order_id' | 'created_at'> {
  // Các trường bắt buộc khi tạo order mới
} 