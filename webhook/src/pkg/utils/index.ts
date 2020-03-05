import crypto from 'crypto'

function createHmac(pageId: string, customerId: string): string | null {
  const key = process.env.PRIVATE_KEY
  return key
    ? crypto
        .createHmac('sha256', key)
        .update(JSON.stringify({ pageId, customerId }))
        .digest('hex')
    : null
}

function isDev(): boolean {
  return process.env.NODE_ENV === 'development'
}

export default {
  createHmac,
  isDev,
}
