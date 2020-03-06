import React, { useState } from 'react'

import './InputNumber.scss'

interface Props {
  defaultValue: number
  min: number
  max: number
  callback: Function
}

const InputNumber = ({ defaultValue, min, max, callback }: Props) => {
  const [value, setValue] = useState(defaultValue)

  function decrease() {
    const n = value - 1
    if (n >= min) {
      setValue(n)
      callback(n)
    }
  }

  function increase() {
    const n = value + 1
    if (n <= max) {
      setValue(n)
      callback(n)
    }
  }

  return (
    <div className="input-number">
      <button onClick={decrease} disabled={value === min}>
        -
      </button>
      <input value={value} disabled />
      <button onClick={increase} disabled={value === max}>
        +
      </button>
    </div>
  )
}

export default InputNumber
