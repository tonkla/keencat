import React from 'react'
import { Redirect } from 'react-router-dom'
import { Card } from 'antd'

import { useStoreState } from '../../store'

const Dashboard = () => {
  const shops = useStoreState(s => s.shopState.shops)

  return shops.length === 0 ? (
    <Redirect to="/shop" />
  ) : (
    <Card title="Dashboard" bordered={false}>
      .
    </Card>
  )
}

export default Dashboard
