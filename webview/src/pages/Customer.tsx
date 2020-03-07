import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, Input } from 'antd'

import { useStoreActions, useStoreState } from '../store'
import api from '../services/api'
import { Customer } from '../typings'

import './Customer.scss'

const CustomerProfile = () => {
  const history = useHistory()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const callback = params.get('edit')
  const [isEditing, setEditing] = useState(callback !== null)

  const customer = useStoreState(s => s.customerState.customer)
  const setCustomer = useStoreActions(a => a.customerState.set)

  const [name, setName] = useState(customer?.name)
  const [phoneNumber, setPhoneNumber] = useState(customer?.phoneNumber)
  const [address, setAddress] = useState(customer?.address)

  const session = useStoreState(s => s.sessionState.session)

  useEffect(() => {
    if (!session || !session.customerId || customer) return
    ;(async () => {
      const c = await api.findCustomer(session, session.customerId)
      if (c) setCustomer(c)
    })()
  }, [location.search, session, customer, setCustomer])

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
      name: (name && name.trim()) || (customer ? customer.name : ''),
      phoneNumber: phoneNumber || (customer ? customer.phoneNumber : ''),
      address: (address && address.trim()) || (customer ? customer.address : ''),
      source: 'messenger',
    }
    setCustomer(c)
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
      <div className="content user">
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
