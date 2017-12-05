const mongoose = require('mongoose')
const Schema = mongoose.Schema

const furnitureStockSchema = new Schema({
  furnitureModel: {
    type: Schema.Types.ObjectId,
    ref: 'FurnitureModel'
},
  quantity: Number,
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  },
  Shelf: String,
  Zone: String
  
})

const FurnitureStock = mongoose.model('FurnitureStock', furnitureStockSchema)

module.exports = FurnitureStock
