import React, { useState } from 'react'
import { Button, Input } from 'antd'

import './Customer.scss'

const Customer = () => {
  const [isEdited, setIsEdited] = useState(false)

  function handleClickSave() {
    setIsEdited(false)
  }

  function handleClickCancel() {
    setIsEdited(false)
  }

  return (
    <main>
      <div className="content user">
        <h1>Profile</h1>
        <div>
          <h2>Shipping Information</h2>
          <div className="form">
            <div className="row">
              <Input placeholder="Name" disabled={!isEdited} />
            </div>
            <div className="row">
              <Input placeholder="Phone Number" disabled={!isEdited} />
            </div>
            <div className="row">
              <Input.TextArea placeholder="Address" disabled={!isEdited} />
            </div>
            <div className="row btns">
              {isEdited ? (
                <>
                  <Button onClick={handleClickSave} type="primary">
                    Save
                  </Button>
                  <Button onClick={handleClickCancel} type="link">
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEdited(true)} type="primary">
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

export default Customer
