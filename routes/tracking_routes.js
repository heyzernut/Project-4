const express = require('express')
const router = express.Router()
const Tracking = require('../models/tracking')

//get all the roles
router.get('/', (req,res) => {

  Tracking
  .find()
  .populate({
    path: 'order',
    populate: {
      path: 'items'
    },
      populate: {
        path: 'deliveryOrderId'
      },
       populate: {
         path: 'reseller'
       }
  })
  .then(trackings => {
    res.render('tracking/showAll', {
      trackings
    })
  })
  .catch(err => {
    console.log(err)
  })
})


module.exports = router
