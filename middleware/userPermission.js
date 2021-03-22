// role based permission - if admin, allow them to post, put, patch, delete resource paths
import User from '../models/User.js'

const checkPermission = async function (req, res, next) {
  const user = await User.findById(req.user)
  // console.log(userPermission) 
  
  if (user.isAdmin == true) {
    next()
  } else {
    return res.status(401).send({
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

export default checkPermission 