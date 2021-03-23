import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  // TO DO: create a new model schema, and ref: authentication attempts, then populate - put it in get users/ then call save
  username: { type: String, maxlength: 64, required: true },
  // ipAddress: { type: String, maxlength: 64, required: true },
  // didSucceed: { type: Boolean, required: true },
  createdAt: { type: Date, required: true, default: Date.now }
})

const Model = mongoose.model('Attempts', schema)

export default Model