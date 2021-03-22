// install bcrypt, jsonwebtoken
import express from 'express'
import User from '../../models/User.js'
import sanitizeBody from '../../middleware/sanitizeBody.js'
import authenticate from '../../middleware/authUser.js'
const router = express.Router()

// create or register a new user
// TO DO: fix problem, I can only create a user if isAdmin is set to true
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
    res.status(201).send({ data: newUser})
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

// retrieve a currently logged-in user
router.get('/users/me', authenticate, async (req, res) => {
  const id = req.user._id
  const user = await User.findById(id)
  res.send({ data: user })
})

// authenticate user login and return an authentication token
router.post('/tokens', sanitizeBody, async (req, res) => {
  const { email, password } = req.sanitizedBody
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
  res.status(201).send({ message: "Login successful", data: { token: authenticatedUser.generateAuthToken() } })
})

export default router