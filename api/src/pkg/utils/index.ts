import fs from 'fs'
import https from 'https'
import generate from 'nanoid/generate'
import filetype from 'file-type'

import firebase from '../firebase'

function genId(length?: number): string {
  return generate('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', length || 16)
}

function copyImage(shopId: string, productId: string, imgUrl: string): Promise<string> {
  return new Promise(resolve => {
    try {
      const download = `/tmp/${genId()}`
      const file = fs.createWriteStream(download)
      https.get(imgUrl, async response => {
        response.pipe(file)

        console.log('1')
        const mimetype = await filetype.fromFile(download)
        console.log('1.1', mimetype)
        console.log('2')
        const upload = mimetype
          ? `private/${shopId}/${productId}/${productId}-${genId(3)}.${mimetype.ext}`
          : `private/${shopId}/${productId}/${productId}-${genId(3)}.jpg`
        console.log('3')
        console.log(download, upload)
        try {
          const resp = await firebase
            .storage()
            .bucket(`keencat-1.appspot.com/${upload}`)
            .upload(download)
          console.log(Object.keys(resp))
        } catch (e) {
          console.log('err1', e)
        }
        console.log('4')
        // resolve(uploadTo)
      })
    } catch (e) {
      console.log('5')
      console.log(e)
    }
  })
}

export default {
  copyImage,
  genId,
}
