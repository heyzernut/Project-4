const mongoose = require('mongoose')
const Schema = mongoose.Schema

const locationSchema = new Schema({
  type: String,
  warehouseLocation: {
    type: Schema.Types.ObjectId,
    ref: 'WarehouseLocation'
  }
})

const Location = mongoose.model('Location', locationSchema)

module.exports = Location
