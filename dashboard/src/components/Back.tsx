import React from 'react'
import { useHistory } from 'react-router-dom'
import { Icon } from 'antd'

import './Back.scss'

const Back = () => {
  const history = useHistory()
  return (
    <div className="back" onClick={() => history.goBack()}>
      <Icon type="left" />
      <span>BACK</span>
    </div>
  )
}

export default Back
