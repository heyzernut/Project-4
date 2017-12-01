const mongoose = require('mongoose')
const Schema = mongoose.Schema

const discrepanciesSchema = new Schema({
  quantity: Number,
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  },
  orderItem: {
    type: Schema.Types.ObjectId,
    ref: 'OrderItem'
  },
  comment: String
})

const Discrepancies = mongoose.model('Discrepancies', discrepanciesSchema)

module.exports = Discrepancies
