import React from 'react'
import { Redirect } from 'react-router-dom'
import { Card } from 'antd'

import { useStoreState } from '../../store'
import { PATH_SHOP } from '../../constants'

const Dashboard = () => {
  const shops = useStoreState(s => s.shopState.shops)

  return shops.length === 0 ? (
    <Redirect to={PATH_SHOP} />
  ) : (
    <Card title="Dashboard" bordered={false}>
      .
    </Card>
  )
}

export default Dashboard
