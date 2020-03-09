import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { DashboardOutlined, ShopOutlined, ShoppingCartOutlined } from '@ant-design/icons'

import { Shop } from '../typings'
import { PATH_ORDER, PATH_SHOP } from '../constants'

import logo from '../assets/images/logo.png'
import './SiderMenu.scss'

interface Props {
  isCollapsed: boolean
  activeShop?: Shop
}

const SiderMenu = ({ isCollapsed, activeShop }: Props) => {
  const location = useLocation()
  const [openKeys, setOpenKeys] = useState(['/'])

  const appName = process.env.REACT_APP_APP_NAME || ''

  return (
    <div>
      <Layout.Sider collapsible collapsed={isCollapsed} trigger={null} width={200}>
        <div className="brand">
          <div className="logo">
            <img src={logo} alt={appName} title={appName} />
          </div>
          <div className="name">
            <span>{appName}</span>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          onOpenChange={keys => setOpenKeys(keys)}
          openKeys={openKeys}
          selectedKeys={[location.pathname]}
        >
          <Menu.Item key="/">
            <Link to="/">
              <DashboardOutlined />
              <span>Dashboard</span>
            </Link>
          </Menu.Item>
          <Menu.Item key={PATH_SHOP}>
            <Link to={PATH_SHOP}>
              <ShopOutlined />
              <span>Manage Shop</span>
            </Link>
          </Menu.Item>
          {activeShop && (
            <Menu.Item key={PATH_ORDER}>
              <Link to={PATH_ORDER}>
                <ShoppingCartOutlined />
                <span>Orders</span>
              </Link>
            </Menu.Item>
          )}
        </Menu>
      </Layout.Sider>
    </div>
  )
}

export default SiderMenu
