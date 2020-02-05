import React from 'react'
import { useHistory } from 'react-router-dom'
import { Avatar, Dropdown, Icon, Menu, Modal } from 'antd'

import { useStoreActions } from '../store'
import auth from '../services/firebase/auth'
import { User } from '../typings'

interface UserProps extends JSX.IntrinsicAttributes {
  user: User
}

const UserAvatar = ({ user }: UserProps) => {
  const history = useHistory()

  const setUser = useStoreActions(a => a.userState.set)

  const handleSignOut = async () => {
    await auth.signOut()
    setUser(null)
    localStorage.clear()
    history.push('/login')
  }

  const showConfirmSignOut = () => {
    Modal.confirm({
      title: 'Are you sure you want to sign out?',
      onOk() {
        handleSignOut()
      },
    })
  }

  const menu = (
    <Menu>
      <Menu.Item key="3" onClick={showConfirmSignOut}>
        <Icon type="logout" />
        <span>Sign Out</span>
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu}>
      {user.photoURL ? <Avatar src={user.photoURL} /> : <Avatar icon="user" />}
    </Dropdown>
  )
}

export default UserAvatar
