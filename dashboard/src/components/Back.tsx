import React from 'react'
import { useHistory } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons'

import './Back.scss'

const Back = () => {
  const history = useHistory()
  return (
    <div className="back" onClick={() => history.goBack()}>
      <LeftOutlined />
      <span>BACK</span>
    </div>
  )
}

export default Back
