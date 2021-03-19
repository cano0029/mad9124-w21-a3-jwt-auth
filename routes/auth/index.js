import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import express from 'express'
import User from '../../models/User.js'
import sanitizeBody from '../../middleware/sanitizeBody.js'
const router = express.Router()

const saltRounds = 14
const jwtSecretKey = 'supersecretkey'

// create a user
router.post('/users', sanitizeBody, async (req, res) => {
  try {
    const newUser = new User(req.sanitizedBody)
    newUser.password = await bcrypt.hash(newUser.password, saltRounds)
    
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

// authenticate user login and return an authentication token
router.post('/tokens', sanitizeBody, async (req, res) => {
  const { email, password } = req.sanitizedBody
  const user = await User.findOne({ email: email }) // is the username valid? will return either: user object or null,
  if (!user) {
    return res.status(400).send({ 
      errors: [
        {
          status: '400',
          title: 'Validation Error',
          description: 'Come back to this later',
        },
      ]
    })
  }

  // if the supplied username is valid (it exists), we will now see if their password is also valid
  const badHash = `$2b$${saltRounds}$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
  const hashedPassword = user ? user.password : badHash // if we have a user, use the user password. If the user does not match (return null), we will return bad hash (just to protect against hacks)
  
  // compare our database password (hashed password) for that user, with the password supplied by the user (payload.password)
  const passwordDidMatch = await bcrypt.compare(password, hashedPassword)
  if (!passwordDidMatch) {
    return res.status(400).send({ 
      errors: [
        {
          status: '400',
          title: 'Validation Error',
          description: 'Come back to this later',
        },
      ]
    })
  }

  // if email and password are both valid, return a token
  const payload = { uid: user._id }
  const token = jwt.sign(payload, jwtSecretKey)
  res.status(201).send({ data: {token} })
})

export default router