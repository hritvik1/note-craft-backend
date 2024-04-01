import jwt from 'jsonwebtoken'
import { CommonUtils, ErrorResponses } from './utils/index.mjs'

export function VerifyAccessToken(req, res, next) {
  console.debug('VerifyAccessToken %s', req.path)

  const accessToken = req.header('x-access-token')
  console.debug('Access token: %s', accessToken)

  if(!accessToken) {
    CommonUtils.sendErrorResponse(res, ErrorResponses.message.MISSING_ACCESS_TOKEN,
                                  ErrorResponses.name.UNAUTHORIZED_ERROR, 401)
  }

  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

  if(!JWT_SECRET_KEY) {
    console.error('Error executing db query %s', e)
    throw new Error(ErrorResponses.message.ERROR_EXECUTING_DB_QUERY)
  }

  jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
    if(err) {
      CommonUtils.sendErrorResponse(res, ErrorResponses.message.MISSING_ACCESS_TOKEN,
                                    ErrorResponses.name.UNAUTHORIZED_ERROR, 401)
    }
    else {
      req.userId = decoded._id
      next()
    }
  })
}

export function VerifyRefreshToken(req, res, next) {
  console.debug('VerifyRefreshToken %s', req.path)

  const refreshToken  = req.header('x-refresh-token'),
        userId        = req.header('_id')

  console.debug('Refresh token: %s, User ID: %s', refreshToken, userId)

}
