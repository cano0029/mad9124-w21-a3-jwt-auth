// role based permission - if admin, allow them to post, put, patch, delete
import User from '../models/User.js'

export default function (req, res, next) {
  // TO DO: fix. Only reads User model schema isAdmin which defaults to false
  // I need it to read the specific user's isAdmin property.... but how?? 
  req.user = { isAdmin: true}
  const userPermission = req.user
  console.log(userPermission) // outputs false
  
  if (userPermission) {
    next()
  } else {
    return res.status(403).send({
      errors: [
        {
          status: '401',
          title: 'Unauthorized',
          description: 'You do not have the correct permission to perform this action'
        },
      ]
    })
  }
}