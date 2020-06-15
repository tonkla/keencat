import fs from 'fs'
import https from 'https'
import filetype from 'file-type'

import firebase from '../firebase'
import utils from '../utils'

function copyImage(shopId: string, orderId: string, source: string): Promise<string> {
  return new Promise(resolve => {
    const localFilePath = `/tmp/${utils.genId()}`
    const file = fs.createWriteStream(localFilePath)
    https.get(source, response => {
      response.pipe(file)
      file.on('close', async () => {
        const date = new Date().toISOString().split('-')
        const month = `${date[0]}${date[1]}`
        const filepath = `private/${month}/${shopId}/${orderId}/${orderId}-${utils.genId(3)}`
        const mimetype = await filetype.fromFile(localFilePath)
        const destination = mimetype ? `${filepath}.${mimetype.ext}` : `${filepath}.jpg`
        const contentType = mimetype ? mimetype.mime : 'image/jpeg'
        firebase
          .storage()
          .bucket()
          .upload(localFilePath, { destination, contentType, public: true }, (err, file) => {
            if (err) resolve('')
            else if (file) resolve(file.metadata.mediaLink)
            fs.unlink(localFilePath, () => {})
          })
      })
    })
  })
}

export default {
  copyImage,
}
