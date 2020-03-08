import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, Descriptions, message, Modal, Select, Tag, Input } from 'antd'
import moment from 'moment'

import { useStoreActions, useStoreState } from '../../store'
import { customerRepository, orderRepository, productRepository } from '../../services/repositories'
import { PATH_PRODUCT } from '../../constants'
import { Customer, Order, OrderStatus, OrderStatusEnum, Product } from '../../typings'

import Loading from '../../components/Loading'
import Back from '../../components/Back'

const OrderItem = () => {
  const [order, setOrder] = useState<Order>()
  const [products, setProducts] = useState<Product[]>()
  const [customer, setCustomer] = useState<Customer>()
  const [imgSrc, setImgSrc] = useState('')

  const { id } = useParams()

  const orders = useStoreState(s => s.orderState.orders)

  const updateProduct = useStoreActions(a => a.productState.update)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const activeOrder = orders.find(o => o.id === id)
      if (activeOrder) setOrder(activeOrder)
      else {
        const order = await orderRepository.find(id)
        if (order) setOrder(order)
      }
    })()
  }, [id, orders])

  useEffect(() => {
    if (!order) return
    ;(async () => {
      // Fetch customer
      const customer = await customerRepository.find(order.customerId)
      if (customer) setCustomer(customer)
      // Fetch products
      setProducts(await productRepository.findByIds(order.items.map(item => item.productId)))
    })()
  }, [order])

  async function handleChangeStatus(value: string) {
    if (!order || order.status === value) return
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

      // Decrease a product's available quantity
      if (status === 'paid') {
        order.items.forEach(async item => {
          const product = await productRepository.find(item.productId)
          if (product) {
            const qty = product.quantity - item.quantity
            updateProduct({ ...product, quantity: qty >= 0 ? qty : 0 })
          }
        })
      }
    } else {
      message.error('Cannot update the order status.')
    }
  }

  function handleChangeNote(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (order) setOrder({ ...order, note: e.currentTarget.value.trim() })
  }

  async function handleSaveNote() {
    if (order) {
      await orderRepository.update(order)
      message.success('The order note has been saved.')
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

  function renderOrderItems(order: Order) {
    return !products || products.length < 1 ? (
      <Loading size="small" position="left" />
    ) : (
      order.items.map(item => {
        const product = products.find(p => p.id === item.productId)
        return (
          <div key={item.productId} className="order-item">
            <div>
              {!product ? (
                <div>
                  <span>{item.productName}</span>
                </div>
              ) : (
                <Link to={`${PATH_PRODUCT}/${product.id}`}>
                  <div
                    className="cover"
                    style={{
                      backgroundImage:
                        product.images && product.images.length > 0
                          ? `url('${product.images[0]}')`
                          : 'none',
                    }}
                  />
                  <div>
                    <span>{product.name}</span>
                  </div>
                </Link>
              )}
            </div>
            <div>
              <label>Price:</label>
              <span>{item.price}</span>
            </div>
            <div>
              <label>Quantity:</label>
              <span>{item.quantity}</span>
            </div>
            <div>
              <label>Amount:</label>
              <span>{item.amount}</span>
            </div>
          </div>
        )
      })
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
            <Descriptions title="Order Details" column={1} size="middle" bordered>
              <Descriptions.Item label="Date">
                {moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="Items">
                <div className="order-items">{renderOrderItems(order)}</div>
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <div className="price total-amount">
                  <span>{order.totalAmount ? `฿${order.totalAmount.toLocaleString()}` : 0}</span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Customer">
                {!customer ? (
                  <Loading size="small" position="left" />
                ) : (
                  <div>
                    <div>
                      {customer.name} ({customer.phoneNumber})
                    </div>
                    <div>{customer.address}</div>
                  </div>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Attatchments">
                {displayAttatchments(order.attachments)}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {displayStatusTag(order.status)}
                {displayStatusOptions()}
              </Descriptions.Item>
              <Descriptions.Item label="Note">
                <div className="note">
                  <Input.TextArea rows={2} defaultValue={order?.note} onChange={handleChangeNote} />
                  <Button size="small" onClick={handleSaveNote}>
                    Save
                  </Button>
                </div>
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
