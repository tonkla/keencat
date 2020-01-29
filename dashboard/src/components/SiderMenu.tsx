import React, { useCallback, useState } from 'react'
import { Icon, Layout, Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'

import { useStoreState } from '../store'

import logo from '../assets/images/logo.png'
import '../styles/SiderMenu.scss'

const SiderMenu = (props: any) => {
  const activeShop = useStoreState(s => s.activeState.shop)

  const location = useLocation()

  const [openKeys, setOpenKeys] = useState(['/shops'])

  const onOpenChange = useCallback((s: string[]) => {
    setOpenKeys(s)
  }, [])

  const appName = process.env.REACT_APP_APP_NAME || ''

  return (
    <div>
      <Layout.Sider collapsible collapsed={props.collapsed} trigger={null} width={220}>
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
          onOpenChange={onOpenChange}
          openKeys={openKeys}
          selectedKeys={[location.pathname]}
        >
          <Menu.Item key="/">
            <Icon type="dashboard" />
            <span>
              <Link to="/">Dashboard</Link>
            </span>
          </Menu.Item>
          <Menu.Item key="/shop">
            <Icon type="shop" />
            <span>
              <Link to="/shop">Shop</Link>
            </span>
          </Menu.Item>
          {activeShop && (
            <Menu.Item key="/category">
              <Icon type="folder" />
              <span>
                <Link to="/category">Category</Link>
              </span>
            </Menu.Item>
          )}
          {activeShop && (
            <Menu.Item key="/product">
              <Icon type="file" />
              <span>
                <Link to="/product">Product</Link>
              </span>
            </Menu.Item>
          )}
          {activeShop && (
            <Menu.Item key="/inbox">
              <Icon type="message" />
              <span>
                <Link to="/inbox">Inbox</Link>
              </span>
            </Menu.Item>
          )}
          {activeShop && (
            <Menu.Item key="/order">
              <Icon type="unordered-list" />
              <span>
                <Link to="/order">Order</Link>
              </span>
            </Menu.Item>
          )}
        </Menu>
      </Layout.Sider>
    </div>
  )
}

export default SiderMenu
