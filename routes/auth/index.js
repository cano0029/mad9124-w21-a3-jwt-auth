// install bcrypt, jsonwebtoken
import express from 'express'
import User from '../../models/User.js'
import sanitizeBody from '../../middleware/sanitizeBody.js'
const router = express.Router()

// create or register a new user
router.post('/users', sanitizeBody, async (req, res) => {
  try {
    const newUser = new User(req.sanitizedBody)
    const userAlreadyExists = Boolean(
      await User.countDocuments({ email : newUser.email })
    )

    if (userAlreadyExists) {
      return res.status(400).send({
        errors: [
          {
            status: '400',
            title: 'Validation Error',
            description: `Email address ${newUser.email} is already registered`,
            source: { pointer: '/data/attributes/email'}
          }
        ]
      })
    }
    
    await newUser.save()
    res.status(201).send({ data: newUser })
  } catch (err) {
    res.status(500).send({
      errors: [
        {
          status: '500',
          title: 'Server Error',
          description: 'Problem saving document to the database'
        },
      ]
    })
  }
})

// 
router.get('/users/me', async (req, res) => {
  
})

// authenticate user login and return an authentication token
router.post('/tokens', sanitizeBody, async (req, res) => {
  const { email, password } = req.sanitizedBody
  
  // is the username valid based on email? will return either: user object or null - see User Model (refactored)
  // if the supplied username is valid (it exists), we will now see if their password is also valid - see User Model (refactored)
  // compare our database password (hashed password) for that user, with the password supplied by the user (payload.password) - see User Model (refactored)
  
  const authenticatedUser = await User.authenticate(email, password) // authenticated user being returned from User Model 

  if (!authenticatedUser) {
    return res.status(401).send({ 
      errors: [
        {
          status: '401',
          description: 'Incorrect username or password',
        },
      ]
    })
  }

  // if email and password are both valid, return a token - see User Model (refactored)
  res.status(201).send({ data: { token: authenticatedUser.generateAuthToken() } })
})

export default router