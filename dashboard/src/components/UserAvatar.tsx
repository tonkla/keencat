import React from 'react'
import { Avatar, Dropdown, Menu, Modal } from 'antd'
import { ExclamationCircleOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'

import { useStoreActions } from '../store'
import { User } from '../typings'

interface UserProps extends JSX.IntrinsicAttributes {
  user: User
}

const UserAvatar = ({ user }: UserProps) => {
  const signOut = useStoreActions(a => a.userState.signOut)

  const showConfirmSignOut = () => {
    Modal.confirm({
      title: 'Are you sure you want to sign out?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        signOut()
      },
    })
  }

  const menu = (
    <Menu>
      <Menu.Item key="3" onClick={showConfirmSignOut}>
        <LogoutOutlined />
        <span>Sign Out</span>
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu}>
      {user.photoURL ? <Avatar src={user.photoURL} /> : <Avatar icon={<UserOutlined />} />}
    </Dropdown>
  )
}

export default UserAvatar
