const mongoose = require('mongoose')
const Schema = mongoose.Schema

const staffSchema = new Schema({
  name: String,
  password: String,
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role'
  }
})

const Staff = mongoose.model('Staff', staffSchema)

module.exports = Staff
