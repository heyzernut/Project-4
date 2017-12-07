const Category = require('../models/category')
const Tracking = require('../models/tracking')
const express = require('express')
const router = express.Router()


router.get('/',(req, res) => {
  // res.render('audit/view')
  Tracking.find()
  .then((trackings)=>{
    res.render('audit/view', {trackings})
  })
})

module.exports = router
