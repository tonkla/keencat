import React from 'react'
import { useParams } from 'react-router-dom'
import { Card } from 'antd'

import { useStoreState } from '../../store'

import Back from '../../components/Back'

const OrderItem = () => {
  const { id } = useParams()

  const orders = useStoreState(s => s.orderState.orders)
  const order = orders.find(o => o.id === id)

  return (
    <div>
      <Back />
      <Card title="Order">
        {order && (
          <ul>
            <li>ID: {order.id}</li>
            <li>Product: {order.productName}</li>
          </ul>
        )}
      </Card>
    </div>
  )
}

export default OrderItem
