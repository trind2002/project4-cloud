import crypto from 'crypto'

export const generateUUID = () => {
  return crypto.randomUUID()
}

export const BUCKET_NAME = 'mybuckettodos16061';
export const TABLE_NAME = 'Todos';