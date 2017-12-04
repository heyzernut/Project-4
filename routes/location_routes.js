const express = require('express')
const router = express.Router()
const Location = require('../models/location')


router.get('/', (req, res) => {
  res.render('inventory/location')
})

router.get('/new', (req, res) => {
  res.render('inventory/newLocation')
})

router.post('/new', (req, res) => {
  var newLocation = new Location({
    address: req.body.address,
    type: req.body.type
  })
  newLocation.save()
    .then(
      () => res.redirect('/location'),
      err => res.send(err)
    )
})

module.exports = router
