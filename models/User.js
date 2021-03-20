import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const jwtSecretKey = 'supersecretkey'

const schema = new mongoose.Schema ({
  firstName: { type: String, trim: true, maxlength: 64, required: true }, 
  lastName: { type: String, trim: true, maxlength: 64, required: true },
  email: { type: String, trim: true, maxlength: 512, required: true, unique: true }, 
  password: { type: String, trim: true, maxlength: 70, required: true }, 
  isAdmin: { type: Boolean, required: true, default: false }
})

schema.methods.generateAuthToken = function () { // do not use arrow function, need to use 'this'
  const payload = { uid: this._id }
  return jwt.sign(payload, jwtSecretKey)
}

const Model = mongoose.model('User', schema)

export default Model