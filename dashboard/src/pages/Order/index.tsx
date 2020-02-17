import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, DatePicker, Table, Tag } from 'antd'
import moment from 'moment'

import { useStoreActions, useStoreState } from '../../store'
import { orderRepository } from '../../services/repositories'
import { PATH_ORDER } from '../../constants'
import { OrderStatus } from '../../typings'

import Loading from '../../components/Loading'
import './Order.scss'

const OrderIndex = () => {
  const [isLoading, setLoading] = useState(false)

  const shops = useStoreState(s => s.shopState.shops)
  const shopId = useStoreState(s => s.activeState.shopId)
  const activeShop = shops.find(s => s.id === shopId)

  const orders = useStoreState(s => s.orderState.orders)
  const setOrders = useStoreActions(s => s.orderState.setOrders)

  useEffect(() => {
    if (!activeShop) return
    ;(async () => {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]
      setOrders(await orderRepository.findByShop(activeShop.id, today))
      setLoading(false)
    })()
  }, [activeShop, setOrders])

  async function handleChangeDate(_: any, dateString: string) {
    if (!activeShop) return
    const orders = await orderRepository.findByShop(activeShop.id, dateString)
    setOrders(orders)
  }

  function renderStatusTag(status: OrderStatus) {
    const color =
      status === 'unpaid'
        ? 'red'
        : status === 'approving'
        ? 'orange'
        : status === 'paid'
        ? 'green'
        : status === 'rejected'
        ? 'geekblue'
        : status === 'canceled'
        ? 'purple'
        : ''
    return <Tag color={color}>{status.toUpperCase()}</Tag>
  }

  const columns = [
    {
      title: 'Order',
      dataIndex: 'id',
    },
    {
      title: 'Product',
      dataIndex: 'product',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
  ]

  const dataSource = orders.map(order => {
    const id = order.createdAt.replace(/[-T:Z.]/g, '')
    return {
      key: order.id,
      id: <Link to={`${PATH_ORDER}/${order.id}`}>{id}</Link>,
      product: order.productName,
      createdAt: new Date(order.createdAt).toLocaleString('th', { timeZone: 'Asia/Bangkok' }),
      amount: 123,
      status: renderStatusTag(order.status),
    }
  })

  return (
    <div>
      <Card title="Orders" bordered={false}>
        {isLoading ? (
          <Loading position="center" />
        ) : (
          <div>
            <div className="date-picker">
              <span>Date:</span>
              <DatePicker defaultValue={moment()} onChange={handleChangeDate} />
            </div>
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={{ defaultPageSize: 30, total: orders.length }}
            />
          </div>
        )}
      </Card>
    </div>
  )
}

export default OrderIndex
