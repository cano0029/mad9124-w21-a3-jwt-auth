import express from 'express'
const router = express.Router()

router.post('/users', async (req, res) => {
  res.status(201).send({ data: 'new user created' })
})

export default router