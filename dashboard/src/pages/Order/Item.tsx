import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, Descriptions, message, Modal, Select, Tag } from 'antd'
import moment from 'moment'

import { useStoreState } from '../../store'
import { customerRepository, orderRepository } from '../../services/repositories'
import { PATH_CUSTOMER, PATH_PRODUCT } from '../../constants'
import { Customer, Order, OrderStatus, OrderStatusEnum } from '../../typings'

import Loading from '../../components/Loading'
import Back from '../../components/Back'

const OrderItem = () => {
  const [order, setOrder] = useState<Order>()
  const [customer, setCustomer] = useState<Customer>()
  const [imgSrc, setImgSrc] = useState('')

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

  async function handleChangeStatus(value: string) {
    if (!order) return
    const status: OrderStatus =
      value === OrderStatusEnum.Paid
        ? OrderStatusEnum.Paid
        : value === OrderStatusEnum.Rejected
        ? OrderStatusEnum.Rejected
        : value === OrderStatusEnum.Canceled
        ? OrderStatusEnum.Canceled
        : value === OrderStatusEnum.Unpaid
        ? OrderStatusEnum.Unpaid
        : OrderStatusEnum.Approving
    const newOrder = { ...order, status }
    if (await orderRepository.update(newOrder)) {
      setOrder(newOrder)
      message.success('The order status has been updated.')
    } else {
      message.error('Cannot update the order status.')
    }
  }

  function displayAttatchments(attatchments?: string[]) {
    if (!attatchments) return <span />
    return attatchments.map((src, idx) => (
      <img
        key={idx}
        src={src}
        alt="attachment"
        className="attatchment"
        onClick={() => setImgSrc(src)}
      />
    ))
  }

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

  function displayStatusOptions() {
    const { Option } = Select
    return (
      <Select placeholder="Update Status" onChange={handleChangeStatus} style={{ width: 150 }}>
        <Option value={OrderStatusEnum.Unpaid}>Unpaid</Option>
        <Option value={OrderStatusEnum.Approving}>Approving</Option>
        <Option value={OrderStatusEnum.Paid}>Paid</Option>
        <Option value={OrderStatusEnum.Rejected}>Rejected</Option>
        <Option value={OrderStatusEnum.Canceled}>Cancel</Option>
      </Select>
    )
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
              <Descriptions.Item label="Amount">
                {order.amount ? order.amount.toLocaleString() : 0}
              </Descriptions.Item>
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
              <Descriptions.Item label="Attatchments">
                {displayAttatchments(order.attachments)}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {displayStatusTag(order.status)}
                {displayStatusOptions()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Card>
      <Modal footer={null} visible={imgSrc !== ''} onCancel={() => setImgSrc('')}>
        <div className="modal-body">
          <img src={imgSrc} alt="attachment" />
        </div>
      </Modal>
    </div>
  )
}

export default OrderItem
