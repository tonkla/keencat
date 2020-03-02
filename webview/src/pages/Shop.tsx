import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import api from '../services/api'
import { Shop } from '../typings'

import Loading from '../components/Loading'

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
    <Loading />
  ) : (
    <div>
      <div>{shop.name}</div>
      <div>
        <span>Phone Number: </span>
        <span>{shop.phoneNumber}</span>
      </div>
      <div>
        <span>Bank: </span>
        <div>
          <span>{shop.bank}</span>
        </div>
        <div>
          <span>{shop.bankAccountNumber}</span>
        </div>
        <div>
          <span>{shop.bankAccountName}</span>
        </div>
      </div>
    </div>
  )
}

export default ShopIndex
