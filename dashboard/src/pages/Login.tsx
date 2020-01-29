import React, { useEffect, useRef, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Alert, Button, Icon, Input } from 'antd'

import { useStoreState, useStoreActions } from '../store'
import api from '../services/api'

import '../styles/Login.scss'

const Login: React.FC = () => {
  const KEY_EMAIL = 'signinemail'

  const [isLoading, setLoading] = useState(false)
  const [isDone, setDone] = useState(false)
  const [email, setEmail] = useState('')
  const inputEmail = useRef<Input>(null)

  const setUser = useStoreActions(a => a.userState.set)
  const user = useStoreState(s => s.userState.user)

  useEffect(() => {
    const _email = localStorage.getItem(KEY_EMAIL)
    if (_email) setEmail(_email)
  }, [])

  const handleChangeEmail = (e: any) => {
    const _email = e.target.value.trim()
    setEmail(_email)
    localStorage.setItem(KEY_EMAIL, _email)
  }

  const handleSignIn = async () => {
    if (!/(.+)@(.+){2,}\.(.+){2,}/.test(email)) {
      if (inputEmail && inputEmail.current) {
        inputEmail.current.input.value = ''
        inputEmail.current.input.focus()
        localStorage.setItem(KEY_EMAIL, '')
      }
      return
    }
    if (process.env.NODE_ENV === 'production') {
      setLoading(true)
      await api.sendSignInLinkToEmail(email)
      setLoading(false)
      setDone(true)
    } else {
      const u = {
        id: 'test',
      }
      setUser(u)
    }
  }

  return user ? (
    <Redirect to="/" />
  ) : (
    <div className="login-container">
      <div className="col">
        <h1 className="app-name">{process.env.REACT_APP_APP_NAME || ''}</h1>
        <h2>Ecommerce Chatbot Platform for Your Business</h2>
        <section className="form">
          <Input
            ref={inputEmail}
            onChange={handleChangeEmail}
            value={email}
            placeholder="Email"
            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.3)' }} />}
            size="large"
            className="input"
          />
          <Button
            onClick={handleSignIn}
            loading={isLoading}
            disabled={isDone}
            type="primary"
            size="large"
            className="button"
          >
            Sign In
          </Button>
        </section>
        {isDone && (
          <section className="message">
            <Alert message="We have sent a sign-in link to your email." type="success" showIcon />
          </section>
        )}
      </div>
    </div>
  )
}

export default Login
