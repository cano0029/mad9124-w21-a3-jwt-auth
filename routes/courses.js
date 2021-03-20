import createDebug from 'debug'
import sanitizeBody from '../middleware/sanitizeBody.js'
import authenticate from '../middleware/authUser.js'
import checkPermission from '../middleware/userPermission.js'
import { Course } from '../models/index.js'
import express from 'express'

const debug = createDebug('mad9124-w21-a3-jwt-auth:routes:courses')
const router = express.Router()

router.get('/', authenticate, async (req, res) => {
  const course = await Course.find().populate('students')
  res.send({data: course})
})

router.post('/', authenticate, checkPermission, sanitizeBody,  async (req, res) => {
  try {
    const newCourse = new Course(req.sanitizedBody)
    await newCourse.save()
    res.status(201).send({ data: newCourse })
  } catch (err) {
    debug(err)
    res.status(500).send({
      errors: [
        {
          status: '500',
          title: 'Server error',
          description: 'Problem saving course to the database.',
        },
      ],
    })
  }
})

router.get('/:id', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('students')
    if (!course) {
      throw new Error ('Resource not found')
    }
    res.send({data: course})
  } catch (err) {
    sendResourceNotFound(req, res)
  }
})

router.put('/:id', authenticate, checkPermission, sanitizeBody, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.sanitizedBody,
      {
        new: true,
        overwrite: true,
        runValidators: true,
      }
    )
    if (!course) throw new Error('Resource not found')
    res.send({ data: course })
  } catch (err) {
    sendResourceNotFound(req, res)
  }
})

router.patch('/:id', authenticate, checkPermission, sanitizeBody, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id, 
      req.sanitizedBody, 
      {
        new: true,
        overwrite: true,
        runValidators: true
      })
    if (!course) {
      throw new Error ('Resource not Found')
    }
    res.send({data: course})
  } catch (err) {
    sendResourceNotFound(req, res)
  }
})

router.delete('/:id', authenticate, checkPermission, async (req, res) => {
  try {
    const course = await Course.findByIdAndRemove(req.params.id)
    if (!course) {
      throw new Error ('Resource not Found')
    }
    res.send({data: course})
  } catch (err) {
    sendResourceNotFound(req, res)
  }
})

function sendResourceNotFound(req, res){
  res.status(404).send({
  errors: [
    {
      status: '404',
      title: 'Resource does not exist',
      description: `We could not find a course with id: ${req.params.id}`
    }]
  })
}

export default router