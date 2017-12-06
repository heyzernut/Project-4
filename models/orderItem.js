const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')

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

orderItemSchema.virtual('formattedDate').get(function () {
  return moment(this.return_date).format('L')
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema)

module.exports = OrderItem
