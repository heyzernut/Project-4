const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderItemSchema = new Schema({
  quantity_ordered: Number,
  return_date: Date,
  order_type: String,
  furnitureStockId: {
    type: Schema.Types.ObjectId,
    ref: 'FurnitureStock'
  },
  deliveryOrderId: {
    type: Schema.Types.ObjectId,
    ref: 'DeliveryOrder'
  }
})

const OrderItem = mongoose.model('OrderItem', orderItemSchema)

module.exports = OrderItem
