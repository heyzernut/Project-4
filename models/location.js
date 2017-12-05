const mongoose = require('mongoose')
const Schema = mongoose.Schema
const toJson = require('meanie-mongoose-to-json')

const locationSchema = new mongoose.Schema({
  address: String,
  type: String,
  zone_start: String,
  zone_stop: String,
  zone: [String],
  shelf_start: Number,
  shelf_stop: Number,
  shelf: [Number],
  warehouseLocation: {
    type: Schema.Types.ObjectId,
    ref: 'WarehouseLocation'
  }
})

locationSchema.plugin(toJson)

const Location = mongoose.model('Location', locationSchema)

module.exports = Location
