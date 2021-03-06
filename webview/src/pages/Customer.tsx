import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, Input } from 'antd'

import { useStoreActions, useStoreState } from '../store'
import { Customer } from '../typings'

import './Customer.scss'

const CustomerProfile = () => {
  const [height, setHeight] = useState(0)
  const history = useHistory()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const callback = params.get('edit')
  const [isEditing, setEditing] = useState(callback !== null)

  const customer = useStoreState(s => s.customerState.customer)
  const setCustomer = useStoreActions(a => a.customerState.set)

  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')

  const session = useStoreState(s => s.sessionState.session)

  useEffect(() => {
    if (customer) {
      setName(customer.name)
      setPhoneNumber(customer.phoneNumber)
      setAddress(customer.address)
    }
  }, [customer])

  useEffect(() => {
    const elMain = document.getElementById('container')
    const height = elMain ? elMain.offsetHeight - 40 : 0
    setHeight(height)
  }, [])

  function handleChangePhoneNumber(e: any) {
    const number = e.currentTarget.value
    const regexNumeric = /(^\d+$|^$)/
    if (regexNumeric.test(number)) setPhoneNumber(number)
    else setPhoneNumber(phoneNumber || '')
  }

  function handleClickSave() {
    if (!session || !session.customerId) return
    const c: Customer = {
      id: session.customerId,
      name: (name && name.trim()) || '',
      phoneNumber: phoneNumber || '',
      address: (address && address.trim()) || '',
    }
    setCustomer({ customer: c, session })
    setEditing(false)
    if (callback) history.goBack()
  }

  function handleClickCancel() {
    setName(customer ? customer.name : '')
    setPhoneNumber(customer ? customer.phoneNumber : '')
    setAddress(customer ? customer.address : '')
    setEditing(false)
    if (callback) history.goBack()
  }

  return (
    <main>
      <div className="content user" style={{ height: height > 0 ? height : '95%' }}>
        <h1>Profile</h1>
        <div>
          <div className="form">
            <div className="row">
              <Input
                placeholder="Name"
                disabled={!isEditing}
                value={name}
                onChange={e => setName(e.currentTarget.value)}
              />
            </div>
            <div className="row">
              <Input
                placeholder="Phone Number"
                disabled={!isEditing}
                value={phoneNumber}
                onChange={handleChangePhoneNumber}
              />
            </div>
            <div className="row">
              <Input.TextArea
                placeholder="Shipping Address"
                disabled={!isEditing}
                value={address}
                onChange={e => setAddress(e.currentTarget.value)}
              />
            </div>
            <div className="row btns">
              {isEditing ? (
                <>
                  <Button onClick={handleClickSave} type="primary">
                    Save
                  </Button>
                  <Button onClick={handleClickCancel} type="link">
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditing(true)} type="primary">
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default CustomerProfile
