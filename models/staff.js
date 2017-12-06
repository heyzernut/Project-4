const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Role = require('../models/role')

const bcrypt = require('bcrypt')

const staffSchema = new Schema({
  name: String,
  password: String,
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role'
  }
})

staffSchema.pre('save', function (next) {
  var staff = this

  bcrypt.hash(staff.password, 10)
  .then(hash => {
    staff.password = hash
    console.log('pre save flow', staff)
    next()
  })
})

staffSchema.methods.validPassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, callback)
}


const Staff = mongoose.model('Staff', staffSchema)

module.exports = Staff
