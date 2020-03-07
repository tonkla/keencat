export interface Shop {
  id: string
  name: string
  pageId: string
  categoryIds: string[]
  ownerId: string
  isActive: boolean
  phoneNumber?: number
  promptPay?: string
  bank?: string
  bankAccountNumber?: string
  bankAccountName?: string
}
