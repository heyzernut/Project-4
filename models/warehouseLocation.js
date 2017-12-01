const mongoose = require('mongoose')
const Schema = mongoose.Schema

const warehouseLocationSchema = new Schema({
  zone: String,
  shelf: String
})

const WarehouseLocation = mongoose.model('WarehouseLocation', warehouseLocationSchema)

module.exports = WarehouseLocation
