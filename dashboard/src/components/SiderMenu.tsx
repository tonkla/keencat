import React, { useState } from 'react'
import { Icon, Layout, Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'

import { Shop } from '../typings'
import { PATH_SHOP } from '../constants'

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
      <Layout.Sider collapsible collapsed={isCollapsed} trigger={null} width={220}>
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
            <Icon type="dashboard" />
            <span>
              <Link to="/">Dashboard</Link>
            </span>
          </Menu.Item>
          <Menu.Item key={PATH_SHOP}>
            <Icon type="shop" />
            <span>
              <Link to={PATH_SHOP}>Manage Shop</Link>
            </span>
          </Menu.Item>
          {activeShop && (
            <Menu.Item key="/inbox">
              <Icon type="message" />
              <span>
                <Link to="/inbox">Inbox</Link>
              </span>
            </Menu.Item>
          )}
          {activeShop && (
            <Menu.Item key="/orders">
              <Icon type="unordered-list" />
              <span>
                <Link to="/orders">Order</Link>
              </span>
            </Menu.Item>
          )}
        </Menu>
      </Layout.Sider>
    </div>
  )
}

export default SiderMenu
