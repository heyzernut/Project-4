const express = require('express')
const router = express.Router()
const DeliveryOrder = require('../models/deliveryOrder')
const Tracking = require('../models/tracking')
const moment = require('moment')
const Customer = require('../models/customer')
const Item =require('../models/orderItem')
const FurnitureModel = require('../models/furnitureModel')

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
  //get customerm & furniture
  FurnitureModel.find()
  .then((models)=>{
    Customer.find()
    .then((customers)=>{
      console.log(customers)
      res.render('orders/new', {today, customers, models})
    })
  })

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
  //Add orderItem
  const newItem = new Item({
    quantity_ordered: orderData.orderQuantity,
    return_date: orderData.returnDate,
    order_type: orderData.orderType,
    // furnitureStockId: ,
    deliveryOrderId: newOrder.id
  })
  newItem.save()
  newOrder.items.push(newItem.id)

  //create a tracking id
  const newTracking = new Tracking({
    order: newOrder.id
  })
    newTracking.save()

    newOrder.save()
    .then(()=> res.json(newOrder))
    .catch((err)=> console.log(err.message))
  })

//delivery trackingSchema
router.get('/:id/tracking', (req, res)=>{
    var id = req.params.id
    DeliveryOrder.findOne({_id: id})
    .then(delivery => {
      res.render('orders/tracking', {
        delivery
      })
    })
    .catch(err => {
      console.log(err)
    })

    // res.json(req)
  // Tracking.find()
  // .then((track) => {
  //   res.render('orders/tracking',{track})
  // })
})

//read & delete individual order
router.get('/:id', (req, res)=>{
  DeliveryOrder.findById(req.params.id)
  .populate('items')
  .then((order)=>{
    res.render('orders/showOne',{order})
  })
  .catch((err)=>console.log(err))
})
router.delete('/:id', (req, res)=>{
  console.log('delete')
  DeliveryOrder.findByIdAndRemove(req.params.id)
  .then(()=> res.redirect('/orders'))
  .catch((err)=> console.log(err))
})

router.post('/:id/tracking', (req, res)=>{
    let trackingData = req.body
    var newTracking = new Tracking({
      status: trackingData.trackStatus,
      comment: trackingData.trackingComment,
      order: req.params.id
    })
    newTracking.save()
    .then(
      () => res.redirect('/orders'),
      err => res.send(err)
    )

    // res.json(req)
  // Tracking.find()
  // .then((track) => {
  //   res.render('orders/tracking',{track})
  // })
})


module.exports = router
