import jwt from 'jsonwebtoken'

const jwtSecretKey = 'supersecretkey'

export default function (req, res, next) {
  const token = req.header('Authentication')
  if(!token) {
    return res.status(401).send({
      errors: [
        {
          status: '401',
          title: 'Authentication failed',
          description: 'Missing bearer token'
        },
      ]
    })
  }
}