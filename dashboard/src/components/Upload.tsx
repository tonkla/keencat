import React, { useEffect, useState } from 'react'
import { Icon, Modal, Upload } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'

import storage from '../services/firebase/storage'
import { Product } from '../typings'

interface UploadProps {
  onError: Function
  onSuccess: Function
  onRemove: Function
  product: Product
}

const ImageUpload = ({ onError, onSuccess, onRemove, product }: UploadProps) => {
  const [fileList, setFileList] = useState<UploadFile<any>[]>()
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  useEffect(() => {
    if (!product.images) return
    const list: UploadFile<any>[] = []
    product.images.forEach((img, idx) => {
      const file: UploadFile = {
        uid: `-${idx + 1}`,
        size: 1024,
        name: 'image.jpg',
        type: 'image/jpeg',
        status: 'done',
        url: img,
      }
      list.push(file)
    })
    setFileList(list)
  }, [product])

  function getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  function handleVerify(file: File, fileList: any): boolean {
    if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
      onError(new Error('Image format should be JPEG or PNG.'))
      return false
    }
    if (file.size / 1024 / 1024 > 5) {
      onError(new Error('Image size should smaller than 5MB.'))
      return false
    }
    return true
  }

  async function handleFileUpload({ onError: _error, onSuccess: _success, file }: any) {
    const imageUrl = await storage.uploadImage(file, product.id, product.shopId)
    if (imageUrl) {
      _success(null, file)
      onSuccess(imageUrl)
    } else {
      const e = new Error('Upload failed')
      _error(e)
      onError(e)
    }
  }

  function handleChange(info: any) {
    if (!info.file.status) return
    if (info.file.status === 'uploading') {
      const img = info.fileList.pop()
      info.fileList.push({ ...img, percent: 50 })
    }
    setFileList([...info.fileList])
  }

  async function handlePreview(file: any) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
  }

  async function handleRemove(file: UploadFile): Promise<boolean> {
    return new Promise(resolve => {
      Modal.confirm({
        title: 'Are you sure you want to delete?',
        content: 'The image will be permanently deleted.',
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        async onOk() {
          // Note: the URL is setted within useEffect()
          if (file.url) {
            await storage.deleteImage(file.url)
            onRemove(file.url)
          }
          resolve(true)
        },
      })
    })
  }

  const uploadButton = (
    <div>
      <Icon type="plus" style={{ color: '#c0c0c0', fontSize: 30 }} />
      <div>Upload</div>
    </div>
  )

  return (
    <div style={{ marginTop: 20 }}>
      <Upload
        listType="picture-card"
        fileList={fileList}
        beforeUpload={handleVerify}
        customRequest={handleFileUpload}
        onChange={handleChange}
        onPreview={handlePreview}
        onRemove={handleRemove}
      >
        {fileList && fileList.length >= 5 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}

export default ImageUpload
