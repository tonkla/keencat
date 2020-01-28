import React from 'react'
import { useHistory } from 'react-router-dom'
import { Dropdown, Icon, Menu, Modal } from 'antd'

import { useStoreActions } from '../store'
import facebook from '../services/facebook'
import { UserProps } from '../typings/user'

const UserAvatar = ({ user }: UserProps) => {
  const history = useHistory()

  const setUser = useStoreActions(a => a.userState.set)

  const handleLogOut = async () => {
    const { status } = await facebook.getLoginStatus()
    if (status === 'connected') await facebook.logOut()
    // Note: FB.logout() doesn't work on localhost
    setUser(null)
    history.push('/login')
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
          <img src={user.pictureUrl} alt={user.name} />
        </div>
        <div className="name">{user.name.split(' ')[0].slice(0, 10)}</div>
      </div>
    </Dropdown>
  )
}

export default UserAvatar
