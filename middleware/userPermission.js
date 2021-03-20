// role based permission - if admin, allow them to post, put, patch, delete
import User from '../models/User.js'

export default function (req, res, next) {
  // TO DO: fix
  // I am not accessing User model isAdmin schema property correctly - defaults to else statement even if I change user isAdmin to true
  if (User.isAdmin === true) {
    return next()
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