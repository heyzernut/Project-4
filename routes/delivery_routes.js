const express = require('express')
const router = express.Router()
const DeliveryOrder = require('../models/deliveryOrder')
const Tracking = require('../models/tracking')
const moment = require('moment')
const Customer = require('../models/customer')
const Item =require('../models/orderItem')
const FurnitureModel = require('../models/furnitureModel')
const { adminOrEmployee } = require('../helpers')


//show all delivery order
router.get('/', adminOrEmployee, (req,res)=>{
  DeliveryOrder.find()
  .then((orders)=>{
    res.render('orders/showAll', {orders})
  })
})

//create new order
router.get('/new', adminOrEmployee, (req,res)=>{
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
router.post('/', adminOrEmployee, (req,res)=>{
  let orderData = req.body

  // create a new delivery order
  const newOrder = new DeliveryOrder({
    date: orderData.date,
    invoiceNo: orderData.invoiceNo,
    quotationNo: orderData.quotationNo,
    modeOfTransport: orderData.transport,
    deliveryTime: orderData.delivery_time,
    shippingCost: orderData.transport_cost,
    termOfDelivery: orderData.terms,
    deliveryAddress: orderData.address,
    reseller: orderData.customers
  })

  //Add orderItem
  if ((typeof orderData.model)==="string"){
      const newItem = new Item({
        quantity_ordered: orderData.orderQuantity,
        return_date: orderData.returnDate,
        order_type: orderData.orderType,
        itemCode: orderData.model,
        deliveryOrderId: newOrder.id
      })
      newItem.save()
      newOrder.items.push(newItem.id)
      newOrder.save()
  }else{
    var promises = []
    for (var i=0; i<orderData.model.length; i++){
      const newItem = new Item({
        quantity_ordered: orderData.orderQuantity[i],
        return_date: orderData.returnDate[i],
        order_type: orderData.orderType[i],
        itemCode: orderData.model[i],
        deliveryOrderId: newOrder.id
      })
      promises.push(newItem.save()
      .then(() => {
        newOrder.items.push(newItem._id)
      }))
    }
  }

  //create a tracking id
  const newTracking = new Tracking({
    order: newOrder.id
  })
    newTracking.save()

    Promise.all(promises)
    .then(() => {
      newOrder.save()
      .then(()=>{})
      .catch((err)=> console.log(err.message))
    })
    res.redirect('orders')
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
})

//read & delete individual order
router.get('/:id', adminOrEmployee, (req, res)=>{
  DeliveryOrder.findById(req.params.id)
  .populate(['items','reseller'])
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


router.put('/:id/tracking', (req, res) => {
  var formData = req.body
  Tracking.update({order: req.params.id}, {
      status: formData.trackStatus,
      comment: formData.trackingComment
  })
  .then(() => res.redirect(`/tracking`))
  .catch(err => console.log(err))
})


module.exports = router
