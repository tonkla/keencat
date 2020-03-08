import generate from 'nanoid/generate'

function genId(length?: number): string {
  return generate('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', length || 20)
}

export default {
  genId,
}
