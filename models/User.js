import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import Attempts from './Attempts.js'

const saltRounds = 14
const jwtSecretKey = 'supersecretkey'

const schema = new mongoose.Schema ({
  firstName: { type: String, trim: true, maxlength: 64, required: true }, 
  lastName: { type: String, trim: true, maxlength: 64, required: true },
  email: { type: String, trim: true, lowercase: true, maxlength: 512, required: true, unique: true }, 
  password: { type: String, trim: true, maxlength: 70, required: true }, 
  isAdmin: { type: Boolean, required: true, default: false },
  authentication_attempts: { type: mongoose.Schema.Types.ObjectId, ref: 'Attempts' }
})

// if email and password are both valid, return a token
schema.methods.generateAuthToken = function () { 
  const payload = { uid: this._id }
  return jwt.sign(payload, jwtSecretKey, { expiresIn: '1h', algorithm: 'HS256' })
}

// to get user from route handlers, will have password and versions protected
schema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.__v
  return obj
}

// authenticate login info (email and password)
schema.statics.authenticate = async function (email, password) {
  const user = await this.findOne({ email: email }) 
  const badHash = `$2b$${saltRounds}$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
  const hashedPassword = user ? user.password : badHash
  const passwordDidMatch = await bcrypt.compare(password, hashedPassword)
  return passwordDidMatch ? user : null
}

// changing and saving password
schema.pre('save', async function (next) {
  if(!this.isModified('password')) return next() 
  this.password = await bcrypt.hash(this.password, saltRounds) 
  next()
})

const Model = mongoose.model('User', schema)

export default Model