import { decode } from 'jsonwebtoken'
import { createLogger } from '../utils/logger.mjs'

export const logger = createLogger('utils')
/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken) {
  const decodedJwt = decode(jwtToken)
  return decodedJwt.sub
}

export const RESPONSE_STATUS = {
  SUCCESS: 201,
  BAD_REQUEST:400,
  SERVER_ERROR: 500,
}

export function httpResponse(data, status = RESPONSE_STATUS.SUCCESS) {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    statusCode: status,
    body: JSON.stringify(data)
  }
}

export function httpResponseError(error) {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    statusCode: RESPONSE_STATUS.SERVER_ERROR,
    body: JSON.stringify({ Error: error }),
  }
}
