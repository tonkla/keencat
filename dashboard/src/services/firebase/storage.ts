import firebase from './index'

import utils from '../utils'
import { Product } from '../../typings'

async function uploadImage(file: File, product: Product): Promise<string | null> {
  return new Promise(resolve => {
    let ext: string
    if (file.type === 'image/jpeg') ext = 'jpg'
    else if (file.type === 'image/png') ext = 'png'
    else return null
    const filepath = `public/images/${product.shopId}/${product.id}`
    const filename = `${product.id}-${utils.genId(3)}.${ext}`
    const uploadTask = firebase
      .storage()
      .ref()
      .child(`${filepath}/${filename}`)
      .put(file)
    uploadTask.on(
      'state_changed',
      snapshot => {
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      },
      error => {
        return null
      },
      async () => {
        resolve(await uploadTask.snapshot.ref.getDownloadURL())
      }
    )
  })
}

export default {
  uploadImage,
}
