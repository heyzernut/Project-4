const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roleSchema = new Schema({
  name: String
})

const Role = mongoose.model('Role', staffSchema)

module.exports = Role
