import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopOutlined } from '@ant-design/icons'

import { useStoreState } from '../store'
import api from '../services/api'
import { RequestHeader, Shop } from '../typings'

import Loading from '../components/Loading'
import CategoryList from '../components/CategoryList'

import './Shop.scss'

const ShopIndex = () => {
  const [shop, setShop] = useState<Shop>()
  const [height, setHeight] = useState()

  const { sid } = useParams()

  const hmac = useStoreState(s => s.sessionState.hmac)
  const pageId = useStoreState(s => s.sessionState.pageId)
  const customerId = useStoreState(s => s.sessionState.customerId)

  useEffect(() => {
    if (!(sid && hmac && pageId && customerId)) return
    const elMain = document.getElementById('container')
    const height = elMain ? elMain.offsetHeight - 35 : '95%'
    setHeight(height)
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
        <div className="shop" style={{ height }}>
          <div className="information">
            <div className="name">
              <ShopOutlined />
              <span>{shop.name}</span>
            </div>
            {shop.phoneNumber && (
              <div>
                <label>Phone Number:</label>
                <span>{shop.phoneNumber}</span>
              </div>
            )}
            {shop.promptPay && (
              <div>
                <label>PromptPay ID:</label>
                <span>{shop.promptPay}</span>
              </div>
            )}
            {shop.bank && (
              <div>
                <label>Bank:</label>
                <span>{shop.bank}</span>
              </div>
            )}
            {shop.bankAccountNumber && (
              <div>
                <label>Account Number:</label>
                <span>{shop.bankAccountNumber}</span>
              </div>
            )}
            {shop.bankAccountName && (
              <div>
                <label>Account Name:</label>
                <span>{shop.bankAccountName}</span>
              </div>
            )}
          </div>
          <CategoryList />
        </div>
      </main>
    </>
  )
}

export default ShopIndex
