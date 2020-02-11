import api from '../api'

async function upload(file: any): Promise<boolean> {
  const resp = await api.call('/upload', { file })
  return resp?.status === 200
}

export default {
  upload,
}
