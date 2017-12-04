const express = require('express')
const router = express.Router()
const DeliveryOrder = require('../models/deliveryOrder')
const Tracking = require('../models/tracking')
const moment = require('moment')
const Customer = require('../models/customer')


//show all delivery order
router.get('/', (req,res)=>{
  DeliveryOrder.find()
  .then((orders)=>{
    res.render('orders/showAll', {orders})
  })
})

//create new order
router.get('/new', (req,res)=>{
  //today's data
  let today = moment().format("YYYY-MM-DD")

  //get customer
  let customer = Customer.find()
  res.render('orders/new', {today, customer})
})
router.post('/', (req,res)=>{
  let orderData = req.body

  //create a new delivery order
  const newOrder = new DeliveryOrder({
    date: orderData.date,
    invoiceNo: orderData.invoiceNo,
    quotationNo: orderData.quotationNo,
    modeOfTransport: orderData.transport,
    deliveryTime: orderData.delivery_time,
    shippingCost: orderData.transport_cost,
    termOfDelivery: orderData.terms,
    deliveryAddress: orderData.address,
    reseller: orderData.reseller
  })

  //create a tracking id
  const newTracking = new Tracking({
    order: newOrder.id
  })
  newTracking.save()

  newOrder.save()
  .then(()=> res.redirect('orders/new'))
  .catch((err)=> console.log(err.message))
})

//tracking page
router.get('/tracking', (req,res)=>{
  Tracking.find()
  .populate('order')
  .then((track)=>{
    res.render('orders/tracking', {track})
  })
})

module.exports = router
