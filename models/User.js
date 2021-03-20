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

// if email and password are both valid, return a token
schema.methods.generateAuthToken = function () { // do not use arrow function, need to use 'this'
  const payload = { uid: this._id }
  return jwt.sign(payload, jwtSecretKey)
}

// authenticate login info (email and password)
schema.statics.authenticate = async function (email, password) {
  // is the username valid based on email? will return either: user object or null,
  const user = await User.findOne({ email: email }) 

  // if the supplied username is valid (it exists), we will now see if their password is also valid
  const badHash = `$2b$${saltRounds}$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
  const hashedPassword = user ? user.password : badHash // if we have a user, use the user password. If the user does not match (null), we will return bad hash (just to protect against hacks)
  
  // compare our database password (hashed password) for that user, with the password supplied by the user (payload.password)
  const passwordDidMatch = await bcrypt.compare(password, hashedPassword)
  
  return passwordDidMatch ? user : null // if password matched, return user. If it did not match, return null
}

const Model = mongoose.model('User', schema)

export default Model