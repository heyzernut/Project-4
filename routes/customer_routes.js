const Customer = require('../models/customer')
const express = require('express')
const router = express.Router()

router.get('/new',(req,res) => {
  res.render('customers/new')
})

//create a new customer
router.post('/',(req,res) => {
  var formData = req.body.customer

  var newCustomer = new Customer()
  newCustomer.name = formData.txtName
  newCustomer.companyAddress = formData.txtAddress
  newCustomer.contactPerson = formData.txtContactPerson
  newCustomer.contactNo = formData.txtContactNo
  newCustomer.email = formData.txtEmail

  newCustomer.save()
  .then(
    () => res.redirect(`/customer/update/${newCustomer.id}`),
    err => res.send(err)
  )
})

//get all the customers
router.get('/',(req,res) => {
  Customer.find()
  .then(customers => {

    res.json({customers})

  })
  .catch(err => {
    console.log(err)
  })
})

//get indiviual value to update
router.get('/updateCustomer/:id', (req, res) => {
  // instead of find all, we can `findById`
  Customer
  .findById(req.params.id) // no need limit since there's only one
  // .populate('owner')
  // .populate(<field name>)
  .then(customer => {
    // not restaurants, cos it's single restaurant

    // PITSTOP: look at the views folders here, compare it with the res.render
    // first argument

    res.render('customers/updateCustomer', {
      customer
    })
  })
  .catch(err => {
    console.log(err)
  })
})




router.put('/updateCustomer/:id', (req, res) => {
  // thankfully since we're using mongoose
  // we don't have to find and update separately
  // there's a method in mongoose just for that
  // `findByIdAndUpdate` http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate

  var formData = req.body.customer
  Customer.findByIdAndUpdate(req.params.id, {
    name : formData.txtName,
    companyAddress : formData.txtAddress,
    contactPerson : formData.txtContactPerson,
    contactNo : formData.txtContactNo,
    email : formData.txtEmail
  })
  .then(() => res.redirect(`/customers`))
  .catch(err => console.log(err))
  // after update is done, redirect back to resto id
  // this redirection can go to anywhere as long as you have the routes with you
})


module.exports = router
