const mongoose = require('mongoose')
const Schema = mongoose.Schema

const deliveryOrderSchema = new Schema({
  date: Date,
  modeOfTransport: String,
  deliveryTime: String,
  shippingCost: Number,
  termOfDelivery: String,
  deliveryAddress: String,
  reseller: {
    type: Schema.Types.ObjectId,
    ref: 'Customers'
},
  tracking: {
    type: Schema.Types.ObjectId,
    ref: 'DeliveryOrder'
  }
})

const DeliveryOrder = mongoose.model('DeliveryOrder', deliveryOrderSchema)

module.exports = DeliveryOrder
