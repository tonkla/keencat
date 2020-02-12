import firebase from './index'

async function uploadImage(file: File, productId: string, shopId: string): Promise<string | null> {
  return new Promise(resolve => {
    let ext: string
    if (file.type === 'image/jpeg') ext = 'jpg'
    else if (file.type === 'image/png') ext = 'png'
    else return null
    const filepath = `public/images/${shopId}/${productId}`
    const datetime = new Date()
      .toISOString()
      .replace(/[-T:]/g, '')
      .split('.')[0]
    const filename = `${productId}-${datetime}.${ext}`
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

async function removeImage(imageUrl: string): Promise<boolean> {
  try {
    const paths = imageUrl.match(/public.*\.(jpg|png)/g)
    if (!paths || paths.length < 1) return false
    const filepath = paths[0].replace(/%2F/g, '/')
    await firebase
      .storage()
      .ref()
      .child(filepath)
      .delete()
    return true
  } catch (e) {
    return false
  }
}

export default {
  uploadImage,
  removeImage,
}
