const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bcrypt = require('bcrypt')

const modelSchema = new Schema({
  itemCode: String,
  model: String,
  color: String,
  dimension: String
})
