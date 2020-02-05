import React from 'react'
import { Icon } from 'antd'

import './Loading.scss'

interface LoadingParams {
  position: 'left' | 'center'
}

const Loading = ({ position }: LoadingParams) => {
  return (
    <div className={`loading ${position}`}>
      <Icon type="loading" />
      <span>Loading...</span>
    </div>
  )
}

export default Loading
