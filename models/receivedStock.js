const mongoose = require('mongoose')
const Schema = mongoose.Schema

const receivedStockSchema = new Schema({
  invoiceNo: String,
  batchNo: Number,
  lotNo: Number,
  paymentMethod: String,
  paymentStatus: String,
  chqNo: Number,
  supplier: {
    type: Schema.Types.ObjectId,
    ref: 'Supplier'
},
  furnitureModel: {
    type: Schema.Types.ObjectId,
    ref: 'FurnitureModel'
  }
})

const ReceivedStock = mongoose.model('ReceivedStock', receivedStockSchema)

module.exports = ReceivedStock
