const Customer = require('../models/customer')
const express = require('express')
const router = express.Router()

router.get('/new',(req,res) => {
  res.render('customers/new')

})

module.exports = router
