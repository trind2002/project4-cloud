import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth');

const jwksUrl = 'https://dev-c0tz1rsimfixqjk1.us.auth0.com/.well-known/jwks.json';

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })
  const secret = await getSecret(jwt.header.kid);

  // TODO: Implement token verification
  return jsonwebtoken.verify(token, secret)
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

function certToPEM(cert) {
  cert = cert.match(/.{1,64}/g).join('\n')
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`
  return cert
}

async function getSecret(kid) {
  const res = await Axios.get(jwksUrl)
  const jwtKeys = res.data.keys

  if (!jwtKeys || !jwtKeys.length) {
    throw new Error('The JWKS endpoint is invalid! Did not contains any key!')
  }

  const signingKeys = jwtKeys
    .filter(
      (key) =>
        key.use === 'sig' &&
        key.kty === 'RSA' &&
        key.kid &&
        ((key.x5c && key.x5c.length) || (key.n && key.e))
    )
    .map((key) => {
      return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0]) }
    })

  if (!signingKeys.length) {
    throw new Error('The signature is invalid!')
  }

  const signingKey = signingKeys.find((key) => key.kid === kid)

  if (!signingKey) {
    throw new Error(`Sign in key did not match '${kid}'`)
  }

  return signingKey.publicKey
}
