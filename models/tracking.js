const mongoose = require('mongoose')
const Schema = mongoose.Schema

const trackingSchema = new Schema({
  status: String,
  comment: String
})

const Tracking = mongoose.model('Tracking', trackingSchema)

module.exports = Tracking
