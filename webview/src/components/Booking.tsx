import React, { useState } from 'react'
import { Modal, DatePicker, Radio, Row, Col } from 'antd'
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
  const [fromDate, setFromDate] = useState<moment.Moment>()
  const [toDate, setToDate] = useState<moment.Moment>()
  const [month, setMonth] = useState<moment.Moment>()
  const [hour, setHour] = useState('')

  function disableDate(current: moment.Moment) {
    return product.chargeType === ProductChargeTypeEnum.Hourly && current
      ? current <=
          moment()
            .local()
            .subtract(1, 'days')
      : current <= moment().local()
  }

  function renderHours(product: Product, date: moment.Moment) {
    const openAt = product.openAt ? parseInt(product.openAt) || 0 : 0
    const closeAt = product.closeAt ? parseInt(product.closeAt) || 0 : 0
    const hours = [...Array(24).keys()].filter(h => h >= openAt && h < closeAt)
    const availableHours =
      moment(date).date() !== moment().date() ? hours : hours.filter(h => h > moment().hour())
    return availableHours.length === 0 ? (
      <span style={{ color: '#999' }}>no available hour</span>
    ) : (
      <Radio.Group size="small" onChange={e => setHour(e.target.value)}>
        {availableHours.map(h => (
          <Radio.Button key={h} value={h < 10 ? `0${h}:00` : `${h}:00`}>
            {h < 10 ? `0${h}:00` : `${h}:00`}
          </Radio.Button>
        ))}
      </Radio.Group>
    )
  }

  return (
    <Modal
      title=""
      visible={visible}
      onOk={() =>
        handleOk({
          from: fromDate?.format('YYYY-MM-DD') || '',
          to: toDate?.format('YYYY-MM-DD') || '',
          days: fromDate && toDate ? toDate.diff(fromDate, 'days') : 0,
          month: month?.format('YYYY-MM-01') || '',
          hour,
        })
      }
      onCancel={handleCancel}
    >
      {product.chargeType === ProductChargeTypeEnum.Hourly && (
        <div className="booking">
          <Row>
            <Col span={5}>
              <div className="label">
                <label>Date:</label>
              </div>
            </Col>
            <Col>
              <DatePicker
                disabledDate={disableDate}
                dropdownClassName="ant-picker-dropdown-placement-bottomCenter"
                onSelect={value => setFromDate(value)}
              />
            </Col>
          </Row>
          {fromDate && (
            <Row>
              <Col span={5}>
                <div className="label">
                  <label>Time:</label>
                </div>
              </Col>
              <Col span={19}>{renderHours(product, fromDate)}</Col>
            </Row>
          )}
        </div>
      )}
      {product.chargeType === ProductChargeTypeEnum.Daily && (
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
      {product.chargeType === ProductChargeTypeEnum.Monthly && (
        <div className="booking">
          <Row>
            <Col span={7}>
              <div className="label">
                <label>Month:</label>
              </div>
            </Col>
            <Col>
              <DatePicker
                picker="month"
                disabledDate={current => current && current < moment().endOf('day')}
                dropdownClassName="ant-picker-dropdown-placement-bottomCenter"
                onSelect={value => setMonth(value)}
              />
            </Col>
          </Row>
        </div>
      )}
    </Modal>
  )
}

export default Booking
