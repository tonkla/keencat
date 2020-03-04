import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import api from '../services/api'
import { Shop } from '../typings'

import Loading from '../components/Loading'
import Header from '../components/Header'
import CategoryList from '../components/CategoryList'

import './Shop.scss'

const ShopIndex = () => {
  const [shop, setShop] = useState<Shop>()

  const { sid } = useParams()

  useEffect(() => {
    if (!sid) return
    ;(async () => {
      const shop = await api.findShop(sid)
      if (shop) setShop(shop)
    })()
  }, [sid])

  return !shop ? (
    <div className="mt40">
      <Loading />
    </div>
  ) : (
    <>
      <Header />
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
