import React from 'react'
import { Link } from 'react-router-dom'
import { List, Tag } from 'antd'

import { Product } from '../../typings/product'
import { PATH_PRODUCT } from '../../constants'

interface Props {
  products: Product[]
}

const ProductList = ({ products }: Props) => {
  return (
    <List
      itemLayout="horizontal"
      size="small"
      dataSource={products}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            avatar={
              item.images && item.images.length > 0 ? (
                <Link to={`${PATH_PRODUCT}/${item.id}`}>
                  <div className="cover" style={{ backgroundImage: `url(${item.images[0]})` }} />
                </Link>
              ) : (
                <Link to={`${PATH_PRODUCT}/${item.id}`}>
                  <div className="cover" />
                </Link>
              )
            }
            title={
              <Link to={`${PATH_PRODUCT}/${item.id}`}>
                {item.name}
                {item.isActive ? (
                  <Tag color="green">Available</Tag>
                ) : (
                  <Tag color="red">Unavailable</Tag>
                )}
              </Link>
            }
            description={
              <div className="details">
                <span className="price">฿{item.price.toLocaleString()}</span>
                <span className="quantity">( {item.quantity || 0} left )</span>
              </div>
            }
          />
        </List.Item>
      )}
    />
  )
}

export default ProductList
