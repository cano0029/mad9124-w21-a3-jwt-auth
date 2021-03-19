import bcrypt from 'bcrypt'
import express from 'express'
import User from '../../models/User.js'
import sanitizeBody from '../../middleware/sanitizeBody.js'
const router = express.Router()

const saltRounds = 14

router.post('/users', sanitizeBody, async (req, res) => {
  try {
    const newUser = new User(req.sanitizedBody)
    newUser.password = await bcrypt.hash(newUser.password, saltRounds)
    await newUser.save()
    res.status(201).send({ data: newUser })
  } catch (err) {
    res.status(500).send({
      errors: [
        {
          status: '500',
          title: 'Server Error',
          description: 'Problem saving document to the database'
        }
      ]
    })
  }
})

export default router