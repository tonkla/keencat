export type OrderStatus = 'unpaid' | 'approving' | 'paid' | 'rejected' | 'canceled'

export enum OrderStatusEnum {
  Unpaid = 'unpaid',
  Approving = 'approving',
  Paid = 'paid',
  Rejected = 'rejected',
  Canceled = 'canceled',
}

export interface OrderItem {
  productId: string
  price: number
  amount: number
  quantity?: number
  date?: string
  from?: string
  to?: string
  days?: number
  hour?: string
  month?: string
}

export interface Order {
  id: string
  pageId: string
  shopId: string
  ownerId: string
  customerId: string
  status: OrderStatus
  items: OrderItem[]
  totalAmount: number
  attachments?: string[]
  note?: string
  createdAt: string
  createdDate: string
  updatedAt?: string
}
