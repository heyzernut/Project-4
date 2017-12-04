const ReceivedStock = require('../models/receivedStock')
const Supplier = require('../models/supplier')
const express = require('express')
const router = express.Router()
const moment = require('moment')

// Display all supplier
router.get('/', (req, res) => {
  // the return of then
  ReceivedStock.find().limit(20).sort({name: -1})
  .then(incomingstock => {
    // at this point we got our data so we can render our page
    res.render('receivedstock/stock', {
      incomingstock
    })
  })
  .catch(err => {
    console.log(err)
  })
})

// Create new supplier
router.get('/new', (req, res) => {
  Supplier.find()
  .then((supplier)=>{
    res.render('receivedstock/new', {supplier})
  })
  .catch(err => {
    console.log(err)
  })
})

router.get('/new', (req, res) => {
  Supplier.find()
  .then((furnitureModel)=>{
    res.render('receivedstock/new', {furnitureModel})
  })
  .catch(err => {
    console.log(err)
  })
})

router.post('/', (req, res) => {
  var formData = req.body.stock

  var newStock = new ReceivedStock()
  newStock.invoiceNo = formData.invoiceNo
  newStock.batchNo = formData.batchNo
  newStock.lotNo = formData.lotNo
  newStock.paymentMethod = formData.paymentMethod
  newStock.paymentStatus = formData.paymentStatus
  newStock.chqNo = formData.chqNo
  newStock.supplier = formData.supplier
  newStock.furnitureModel = formData.furnitureModel

  newStock.save()
  .then(
    // save
    () => res.redirect(`/incomingstock`),
    err => res.send(err)
  )
})


module.exports = router
