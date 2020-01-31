import React, { useEffect, useRef, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Alert, Button, Icon, Input } from 'antd'

import { useStoreState, useStoreActions } from '../store'
import userRepo from '../services/firebase/firestore/user'
import { User } from '../typings'

import '../styles/Login.scss'

const Login = () => {
  const KEY_EMAIL = 'signinemail'

  const [isLoading, setLoading] = useState(false)
  const [isSending, setSending] = useState(false)
  const [isDone, setDone] = useState(false)
  const [email, setEmail] = useState('')
  const inputEmail = useRef<Input>(null)

  const setUser = useStoreActions(a => a.userState.set)
  const user = useStoreState(s => s.userState.user)

  useEffect(() => {
    ;(async () => {
      if (user) return // The user may be assigned by Redux-Persist
      setLoading(true)
      const u1 = await userRepo.getUser()
      if (u1) setUser(u1)
      else {
        const u2 = await handleSignIn()
        if (u2) setUser(u2)
        else setLoading(false)
      }
    })()
  }, [setUser, user])

  async function handleSignIn(): Promise<User | null> {
    if (!(await userRepo.isSignInWithEmailLink(window.location.href))) return null
    const email = localStorage.getItem(KEY_EMAIL)
    if (!email) return null
    const result = await userRepo.signInWithEmailLink(email, window.location.href)
    if (!result || !result.user || !result.user.email) return null
    localStorage.removeItem(KEY_EMAIL)
    if (result.additionalUserInfo && result.additionalUserInfo.isNewUser) {
      const user: User = {
        email: result.user.email,
        firebaseId: result.user.uid,
      }
      if (await userRepo.create(user)) return user
    } else {
      const user = await userRepo.findByFirebaseId(result.user.uid)
      if (user) return user
      else {
        const user: User = {
          email: result.user.email,
          firebaseId: result.user.uid,
        }
        if (await userRepo.create(user)) return user
      }
    }
    return null
  }

  async function handleSendEmail() {
    if (!/(.+)@(.+){2,}\.(.+){2,}/.test(email)) {
      if (inputEmail && inputEmail.current) {
        inputEmail.current.input.value = ''
        inputEmail.current.input.focus()
      }
      return
    }
    setSending(true)
    localStorage.setItem(KEY_EMAIL, email)
    if (await userRepo.sendSignInLinkToEmail(email)) {
      setDone(true)
    } else {
      // TODO: log cannot send the email
    }
    setSending(false)
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
            onChange={e => setEmail(e.target.value.trim())}
            value={email}
            placeholder="Email"
            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.3)' }} />}
            size="large"
            className="input"
          />
          <Button
            onClick={handleSendEmail}
            loading={isSending}
            disabled={isDone || isLoading}
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
        {isLoading && (
          <div className="loading">
            <Icon type="loading-3-quarters" spin />
            <span>Loading...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
