import { CommonUtils } from './utils/index.mjs'

const pathsToSkip = ['/login', '/signup']

export function VerifyAuthToken(req, res, next) {
  console.debug('VerifyAuthToken: %s', req.path)

  if(pathsToSkip.includes(req.path)) {
    console.debug('Auth token verification skipped')
    return next()
  }

  const authToken = req.cookies.authToken
  console.debug('Auth token: %s', authToken)

  if(!authToken) {
    CommonUtils.sendErrorResponse(res, {
      name    : 'UnauthorizedAccess',
      message : 'Authentication token is missing.',
      code    : 401
    })
  }
}
