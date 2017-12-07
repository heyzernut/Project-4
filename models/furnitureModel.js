const mongoose = require('mongoose')
const Schema = mongoose.Schema

const furnitureModelSchema = new Schema({
  itemCode: String,
  model: String,
  color: String,
  dimension: String,
  barcode: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }
})

const FurnitureModel = mongoose.model('FurnitureModel', furnitureModelSchema)

module.exports = FurnitureModel
