import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopOutlined } from '@ant-design/icons'

import { useStoreActions, useStoreState } from '../store'
import api from '../services/api'
import { Shop } from '../typings'

import Loading from '../components/Loading'
import CategoryList from '../components/CategoryList'

import './Shop.scss'

const ShopIndex = () => {
  const [shop, setShop] = useState<Shop>()
  const [height, setHeight] = useState(0)

  const { sid } = useParams()

  const session = useStoreState(s => s.sessionState.session)
  const customer = useStoreState(s => s.customerState.customer)
  const setCustomer = useStoreActions(a => a.customerState._set)

  useEffect(() => {
    if (!(sid && session)) return
    const elMain = document.getElementById('container')
    const height = elMain ? elMain.offsetHeight - 40 : 0
    setHeight(height)
    ;(async () => {
      const shop = await api.findShop(session, sid)
      if (shop) setShop(shop)
    })()
  }, [sid, session])

  useEffect(() => {
    if (!session || !session.customerId || customer) return
    ;(async () => {
      const c = await api.findCustomer(session, session.customerId)
      if (c) setCustomer(c)
    })()
  }, [session, customer, setCustomer])

  return !shop ? (
    <div className="mt60">
      <Loading />
    </div>
  ) : (
    <>
      <main>
        <div className="content shop" style={{ height: height > 0 ? height : '95%' }}>
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
          <div className="version">v2020031203</div>
        </div>
      </main>
    </>
  )
}

export default ShopIndex
