const Category = require('../models/category')
const Tracking = require('../models/tracking')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  Tracking.find({status: "Received with issues"})
  .populate({
    path: 'order',
    populate: {
      path: 'reseller'
    }
  }).then((trackings) => {
    res.render('audit/view', {trackings})
  })
})

module.exports = router
