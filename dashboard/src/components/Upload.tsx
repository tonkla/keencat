import React from 'react'
import { Button, Upload } from 'antd'

import storage from '../services/firebase/storage'
import { Product } from '../typings'

interface UploadProps {
  onError: Function
  onSuccess: Function
  product: Product
}

const ImageUpload = ({ onError, onSuccess, product }: UploadProps) => {
  function beforeUpload(file: File, fileList: any): boolean {
    if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
      onError('Unsupported file type.')
      return false
    }
    if (file.size / 1024 / 1024 > 5) {
      onError('File size should not more than 5MB.')
      return false
    }
    return true
  }

  async function handleFileUpload({ onError: error, onSuccess: success, file }: any) {
    const imageUrl = await storage.uploadImage(file, product)
    if (imageUrl) {
      success(null, true)
      onSuccess(imageUrl)
    } else {
      const e = new Error('Upload failed')
      error(e)
      onError(e)
    }
  }

  return (
    <div>
      <Upload beforeUpload={beforeUpload} customRequest={handleFileUpload}>
        <Button icon="upload">Upload</Button>
      </Upload>
    </div>
  )
}

export default ImageUpload
