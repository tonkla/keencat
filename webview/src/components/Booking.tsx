import React, { useState } from 'react'
import { Modal, DatePicker, TimePicker, Row, Col } from 'antd'
import moment from 'moment'

import { Product, ProductChargeTypeEnum } from '../typings'

import './Booking.scss'

interface Props {
  product: Product
  visible: boolean
  handleOk: Function
  handleCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const Booking = ({ product, visible, handleOk, handleCancel }: Props) => {
  const [fromDate, setFromDate] = useState<moment.Moment>(moment('2020-03-28'))
  const [toDate, setToDate] = useState<moment.Moment>(moment('2020-03-31'))
  const [time, setTime] = useState<moment.Moment>()

  function disableDate(current: moment.Moment) {
    return product.charge === ProductChargeTypeEnum.Hourly && current
      ? current <=
          moment()
            .local()
            .subtract(1, 'days')
      : current <= moment().local()
  }

  function disableHours() {
    const open = parseInt(moment(product.openAt || 0, 'HH:mm').format('H'))
    const close = parseInt(moment(product.closeAt || 0, 'HH:mm').format('H'))
    const disabledHours = [...Array(24).keys()].filter(h => h < open || h >= close)
    if (
      fromDate?.date() ===
      moment()
        .local()
        .date()
    ) {
      const now = moment()
        .local()
        .hour()
      const pastHours = [...Array(24).keys()].filter(h => h >= open && h <= now)
      return [...disabledHours, ...pastHours]
    }
    return disabledHours
  }

  return (
    <>
      <Modal
        title=""
        visible={visible}
        onOk={() =>
          handleOk({
            from: fromDate?.format('YYYY-MM-DD') || '',
            to: toDate?.format('YYYY-MM-DD') || '',
            days: fromDate && toDate ? toDate.diff(fromDate, 'days') : 0,
            fromTime: time?.format('H') || '',
          })
        }
        onCancel={handleCancel}
      >
        {product.charge === ProductChargeTypeEnum.Hourly && (
          <>
            <div>
              Open: {product.openAt} - {product.closeAt}
            </div>
            <div>
              <label>Date:</label>
              <DatePicker disabledDate={disableDate} onSelect={value => setFromDate(value)} />
            </div>
            {fromDate && (
              <div>
                <label>Time:</label>
                <TimePicker
                  format="HH:00"
                  disabledHours={disableHours}
                  onSelect={value => setTime(value)}
                />
              </div>
            )}
          </>
        )}
        {product.charge === ProductChargeTypeEnum.Daily && (
          <div className="booking">
            <Row>
              <Col span={7}>
                <div className="label">
                  <label>Check-in:</label>
                </div>
              </Col>
              <Col>
                <DatePicker
                  showToday={false}
                  defaultValue={moment('2020-03-28')}
                  dropdownClassName="ant-picker-dropdown-placement-bottomCenter"
                  disabledDate={current => current <= moment().local()}
                  onSelect={value => setFromDate(value)}
                />
              </Col>
            </Row>
            {fromDate && (
              <Row>
                <Col span={7}>
                  <div className="label">
                    <label>Check-out:</label>
                  </div>
                </Col>
                <Col>
                  <DatePicker
                    showToday={false}
                    defaultValue={moment('2020-03-31')}
                    dropdownClassName="ant-picker-dropdown-placement-bottomCenter"
                    defaultPickerValue={moment(fromDate).subtract(1, 'days')}
                    disabledDate={current => current < moment(fromDate).add(1, 'days')}
                    onSelect={value => setToDate(value)}
                  />
                </Col>
              </Row>
            )}
          </div>
        )}
        {product.charge === ProductChargeTypeEnum.Monthly && <div />}
      </Modal>
    </>
  )
}

export default Booking
