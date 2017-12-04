const mongoose = require('mongoose')
const Schema = mongoose.Schema

const trackingSchema = new Schema({
  status: String,
  comment: String,
  order: {
    type: Schema.Types.ObjectId,
    ref: 'DeliveryOrder'
  }
})

const Tracking = mongoose.model('Tracking', trackingSchema)

module.exports = Tracking
