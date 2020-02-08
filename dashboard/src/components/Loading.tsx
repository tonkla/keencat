import React from 'react'
import { Spin } from 'antd'

import './Loading.scss'

interface LoadingParams {
  position?: 'left' | 'center'
  size?: 'default' | 'small' | 'large'
  showText?: boolean
  text?: string
}

const Loading = ({ position, size, showText, text }: LoadingParams) => {
  const _position = position ? position : 'left'
  const _size = size ? size : 'default'
  const _text = text ? text : 'Loading...'
  return (
    <div className={`loading ${_position}`}>
      {showText || showText === undefined ? (
        <Spin tip={_text} size={_size} />
      ) : (
        <Spin size={_size} />
      )}
    </div>
  )
}

export default Loading
