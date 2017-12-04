const mongoose = require('mongoose')
const Schema = mongoose.Schema

const supplierSchema = new Schema({
  name: String,
  location: String,
  contact: String
})


const Supplier = mongoose.model('Supplier', supplierSchema)

module.exports = Supplier
