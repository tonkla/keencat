import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Table } from 'antd'

import { useStoreState } from '../../store'
import { orderRepository } from '../../services/repositories'
import Loading from '../../components/Loading'
import { Order } from '../../typings'
import { PATH_PRODUCT } from '../../constants'

const OrderIndex = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setLoading] = useState(false)

  const shops = useStoreState(s => s.shopState.shops)
  const shopId = useStoreState(s => s.activeState.shopId)
  const activeShop = shops.find(s => s.id === shopId)

  useEffect(() => {
    if (!activeShop) return
    ;(async () => {
      setLoading(true)
      setOrders(await orderRepository.findByShop(activeShop.id))
      setLoading(false)
    })()
  }, [activeShop])

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
    },
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ]

  const dataSource = orders.map(order => ({
    ...order,
    key: order.id,
    productId: <Link to={`${PATH_PRODUCT}/${order.productId}`}>{order.productId}</Link>,
  }))

  return (
    <div>
      <Card title="Orders" bordered={false}>
        {isLoading ? <Loading /> : <Table columns={columns} dataSource={dataSource} />}
      </Card>
    </div>
  )
}

export default OrderIndex
