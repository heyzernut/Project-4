const express = require('express')
const router = express.Router()
const DeliveryOrder = require('../models/deliveryOrder')

//show all delivery order
router.get('/', (req,res)=>{
  res.render('home')
})


module.exports = router
