const mongoose = require('mongoose')
const Schema = mongoose.Schema

const furnitureStockSchema = new Schema({
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
},
  furnitureModel: {
    type: Schema.Types.ObjectId,
    ref: 'FurnitureModel'
},
  quantity: Number
})

const FurnitureStock = mongoose.model('FurnitureStock', furnitureStockSchema)

module.exports = FurnitureStock
