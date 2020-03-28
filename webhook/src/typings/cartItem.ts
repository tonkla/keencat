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
  amount: number
}

export interface CartItemServiceHour extends CartItemService {
  kind: CartItemTypeEnum.Hourly
  date: string
  hour: string
}

export interface CartItemServiceDay extends CartItemService {
  kind: CartItemTypeEnum.Daily
  from: string
  to: string
  days: number
}

export interface CartItemServiceMonth extends CartItemService {
  kind: CartItemTypeEnum.Monthly
  month: string
}

export type CartItem =
  | CartItemGoods
  | CartItemServiceHour
  | CartItemServiceDay
  | CartItemServiceMonth
