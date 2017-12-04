const Supplier = require('../models/supplier')
const express = require('express')
const router = express.Router()

const moment = require('moment')

router.get('/', (req, res) => {
  res.render('suppliers/show')
})

router.get('/new', (req, res) => {
  res.render('suppliers/new')
})





module.exports = router
