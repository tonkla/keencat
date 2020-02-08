import React from 'react'
import { Layout } from 'antd'

import './Footer.scss'

const Footer = () => {
  return (
    <Layout.Footer>
      Crafted with{' '}
      <span className="love" aria-label="love" role="img">
        😻
      </span>{' '}
      by <a href="https://keencat.co">KeenCAT</a>
    </Layout.Footer>
  )
}

export default Footer
