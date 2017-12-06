const Supplier = require('../models/supplier')
const express = require('express')
const router = express.Router()

const moment = require('moment')

// Display all supplier
router.get('/', (req, res) => {
  // the return of then
  Supplier.find().limit().sort({name: -1})
  .then((supplier) => {
    // at this point we got our data so we can render our page
    res.render('suppliers/suppliers',{
      supplier
    })
  })
  .catch(err => {
    console.log(err)
  })
})

// Create new supplier
router.get('/new', (req, res) => {
  res.render('suppliers/new')
})

router.get('/:id', (req, res) => {
  Supplier
  .findById(req.params.id) // no need limit since there's only one
  .then(supplier => {
    res.render('suppliers/show', {
      supplier
    })
  })
  .catch(err => {
    console.log(err)
  })
})

router.post('/', (req, res) => {
  var formData = req.body.supplier

  var newSupplier = new Supplier()
  newSupplier.name = formData.name
  newSupplier.location = formData.location
  newSupplier.contact = formData.contact

  newSupplier.save()
  .then(
    // save
    () => res.redirect(`/suppliers`),
    err => res.send(err)
  )
})

// Update with the input from form
router.put('/:id', (req, res) => {

  var formData = req.body.supplier

  Supplier.findByIdAndUpdate(req.params.id, {
    name: formData.name,
    location: formData.location,
    contact: formData.contact
  })
  .then(() => res.redirect(`/suppliers`))
  .catch(err => console.log(err))
})

// Detele file
router.delete('/:id', (req, res) => {

  Supplier.findByIdAndRemove(req.params.id)
  .then(() => res.redirect(`/suppliers`))
  .catch(err => console.log(err))
})



module.exports = router
