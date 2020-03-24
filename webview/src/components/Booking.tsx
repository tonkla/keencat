import React from 'react'
import { Modal } from 'antd'

import './Booking.scss'

interface Props {
  visible: boolean
  handleOk: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  handleCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const Booking = ({ visible, handleOk, handleCancel }: Props) => {
  return (
    <>
      <Modal title="Booking" visible={visible} onOk={handleOk} onCancel={handleCancel}></Modal>
    </>
  )
}

export default Booking
