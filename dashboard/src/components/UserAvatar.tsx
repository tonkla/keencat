import React from 'react'
import { useHistory } from 'react-router-dom'
import { Dropdown, Icon, Menu, Modal } from 'antd'

import facebook from '../services/facebook'
import { UserProps } from '../typings/user'

const UserAvatar = ({ user }: UserProps) => {
  const history = useHistory()

  const handleLogOut = async () => {
    const { status } = await facebook.getLoginStatus()
    if (status === 'connected') await facebook.logOut()
    localStorage.clear()
    history.push('/')
  }

  const showConfirmLogOut = () => {
    Modal.confirm({
      title: 'Are you sure you want to log out?',
      onOk() {
        handleLogOut()
      },
    })
  }

  const menu = (
    <Menu>
      <Menu.Item key="3" onClick={showConfirmLogOut}>
        <Icon type="logout" />
        <span>Log out</span>
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu}>
      <div className="user">
        <div className="picture">
          <img src={user.picture} alt={user.name} />
        </div>
        <div className="name">{user.name.split(' ')[0].slice(0, 10)}</div>
      </div>
    </Dropdown>
  )
}

export default UserAvatar
