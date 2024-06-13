const jwt = require('jsonwebtoken')
const config = require('./config')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

/**
 * Check token and set decoded user data
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
const jwtMiddleware = async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), config.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    request.user = decodedToken
    next()
  }
  catch (error) {
    response.status(400).json({ message: `Invalid token, ${error.message}` })
  }
}

module.exports = jwtMiddleware