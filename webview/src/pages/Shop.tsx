import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useStoreState } from '../store'
import api from '../services/api'
import { RequestHeader, Shop } from '../typings'

import Loading from '../components/Loading'
import CategoryList from '../components/CategoryList'

import './Shop.scss'

const ShopIndex = () => {
  const [shop, setShop] = useState<Shop>()

  const { sid } = useParams()

  const hmac = useStoreState(s => s.sessionState.hmac)
  const pageId = useStoreState(s => s.sessionState.pageId)
  const customerId = useStoreState(s => s.sessionState.customerId)

  useEffect(() => {
    if (!(sid && hmac && pageId && customerId)) return
    ;(async () => {
      const headers: RequestHeader = {
        hmac,
        pageId,
        customerId,
      }
      const shop = await api.findShop(headers, sid)
      if (shop) setShop(shop)
    })()
  }, [sid, hmac, pageId, customerId])

  return !shop ? (
    <div className="mt60">
      <Loading />
    </div>
  ) : (
    <>
      <main>
        <div className="shop">
          <div className="name">
            <span>{shop.name}</span>
          </div>
          {shop.phoneNumber && (
            <div>
              <span>Phone: </span>
              <span>{shop.phoneNumber}</span>
            </div>
          )}
          {shop.promptPay && (
            <div>
              <span>PromptPay: </span>
              <span>{shop.promptPay}</span>
            </div>
          )}
          {shop.bank && (
            <div>
              <span>Bank: </span>
              <span>{shop.bank}</span>
            </div>
          )}
          {shop.bankAccountNumber && (
            <div>
              <span>Account Number: </span>
              <span>{shop.bankAccountNumber}</span>
            </div>
          )}
          {shop.bankAccountName && (
            <div>
              <span>Account Name: </span>
              <span>{shop.bankAccountName}</span>
            </div>
          )}
        </div>
        <CategoryList />
      </main>
    </>
  )
}

export default ShopIndex
