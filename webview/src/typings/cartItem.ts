import { Product } from './product'

export enum CartItemTypeEnum {
  Goods = 'goods',
  Hourly = 'hourly',
  Daily = 'daily',
  Monthly = 'monthly',
}

export interface CartItemGoods {
  kind: CartItemTypeEnum.Goods
  id: string
  product: Product
  quantity: number
  amount: number
}

interface CartItemService {
  id: string
  product: Product
  from: string
  to: string
  amount: number
}

export interface CartItemServiceHour extends CartItemService {
  kind: CartItemTypeEnum.Hourly
  date: string
  hours: number
}

export interface CartItemServiceDay extends CartItemService {
  kind: CartItemTypeEnum.Daily
  days: number
}

export interface CartItemServiceMonth extends CartItemService {
  kind: CartItemTypeEnum.Monthly
  months: number
}

export type CartItem =
  | CartItemGoods
  | CartItemServiceHour
  | CartItemServiceDay
  | CartItemServiceMonth
