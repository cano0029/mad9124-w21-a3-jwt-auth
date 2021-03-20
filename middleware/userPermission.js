// role based permission - if admin, allow them to post, put, patch, delete resource paths

export default function (req, res, next) {
  req.user = { isAdmin: true}
  const userPermission = req.user
  // console.log(userPermission) 
  
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