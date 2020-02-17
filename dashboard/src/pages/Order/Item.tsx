import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, Descriptions, Tag } from 'antd'
import moment from 'moment'

import { useStoreState } from '../../store'
import { customerRepository, orderRepository } from '../../services/repositories'
import { PATH_CUSTOMER, PATH_PRODUCT } from '../../constants'
import { Customer, Order, OrderStatus } from '../../typings'

import Loading from '../../components/Loading'
import Back from '../../components/Back'

const OrderItem = () => {
  const [order, setOrder] = useState<Order>()
  const [customer, setCustomer] = useState<Customer>()
  const { id } = useParams()

  const orders = useStoreState(s => s.orderState.orders)
  const activeOrder = orders.find(o => o.id === id)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      if (activeOrder) setOrder(activeOrder)
      else {
        const order = await orderRepository.find(id)
        if (order) setOrder(order)
      }
    })()
  }, [id, activeOrder])

  useEffect(() => {
    if (!order) return
    ;(async () => {
      const customer = await customerRepository.find(order.customerId)
      if (customer) setCustomer(customer)
    })()
  }, [order])

  function displayStatusTag(status: OrderStatus) {
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

  return (
    <div>
      <Back />
      <Card>
        {!order ? (
          <Loading position="center" />
        ) : (
          <div>
            <Descriptions title={`Order: ${order.id}`} column={1} size="middle" bordered>
              <Descriptions.Item label="Product">
                <Link to={`${PATH_PRODUCT}/${order.productId}`}>{order.productName}</Link>
              </Descriptions.Item>
              <Descriptions.Item label="Amount">{order.amount}</Descriptions.Item>
              <Descriptions.Item label="Customer">
                {customer ? (
                  <div>
                    <Link to={`${PATH_CUSTOMER}/${customer.id}`}>{customer.id}</Link>
                    <div>{customer.name}</div>
                    <div>{customer.address}</div>
                    <div>{customer.phone}</div>
                  </div>
                ) : (
                  <span>{order.customerId}</span>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Date">
                {moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="Attatchments">{order.attachments}</Descriptions.Item>
              <Descriptions.Item label="Status">{displayStatusTag(order.status)}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Card>
    </div>
  )
}

export default OrderItem
