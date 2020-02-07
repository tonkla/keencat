import React, { useCallback, useState } from 'react'
import { Icon, Layout, Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'

import { useStoreState } from '../store'

import logo from '../assets/images/logo.png'
import './SiderMenu.scss'

const SiderMenu = (props: any) => {
  const shops = useStoreState(s => s.shopState.shops)
  const shopId = useStoreState(s => s.activeState.shopId)
  const activeShop = shops.find(s => s.id === shopId)

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
          <Menu.Item key="/shops">
            <Icon type="shop" />
            <span>
              <Link to="/shops">Shop</Link>
            </span>
          </Menu.Item>
          {activeShop && (
            <Menu.Item key="/categories">
              <Icon type="folder" />
              <span>
                <Link to="/categories">Category</Link>
              </span>
            </Menu.Item>
          )}
          {activeShop && (
            <Menu.Item key="/products">
              <Icon type="picture" />
              <span>
                <Link to="/products">Product</Link>
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
