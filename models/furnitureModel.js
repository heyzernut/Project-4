const mongoose = require('mongoose')
const Schema = mongoose.Schema

const furnitureModelSchema = new Schema({
  itemCode: String,
  model: String,
  color: String,
  dimension: String
})

const FurnitureModel = mongoose.model('FurnitureModel', furnitureModelSchema)

module.exports = FurnitureModel
