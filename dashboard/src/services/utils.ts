import generate from 'nanoid/generate'

function genId(length?: number): string {
  return generate('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', length || 16)
}

function isDev(): boolean {
  return process.env.NODE_ENV === 'development'
}

export default {
  genId,
  isDev,
}
