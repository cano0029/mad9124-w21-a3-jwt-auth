// All POST, PUT, PATCH, and DELETE resource paths should be limited to authenticated users with the isAdmin flag set to true.
// role based permission
import User from '../models/User.js'

export default function (req, res, next) {
  if (User.isAdmin === true) {
    next()
  } else {
    return res.status(403).send({
      errors: [
        {
          status: '403',
          title: 'Forbidden',
          description: 'You do not have administration permission to proceed'
        },
      ]
    })
  }
}