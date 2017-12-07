const Customer = require('../models/customer')
const express = require('express')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('customers/new')
})

//create a new customer
router.post('/', (req, res) => {
  var formData = req.body.customer

  var newCustomer = new Customer()
  newCustomer.name = formData.txtName
  newCustomer.companyAddress = formData.txtAddress
  newCustomer.contactPerson = formData.txtContactPerson
  newCustomer.contactNo = formData.txtContactNo
  newCustomer.email = formData.txtEmail

  newCustomer.save()
    .then(
      () => res.redirect(`/customers`),
      err => res.send(err)
    )
})

//get all the customers
router.get('/', (req, res) => {
  Customer.find()
    .then(customers => {

      res.render('customers/view', {
        customers
      })
    })
    .catch(err => {
      console.log(err)
    })
})

//get indiviual value to update
router.get('/update/:id', (req, res) => {

  Customer
    .findById(req.params.id)
    .then(customer => {
      res.render('customers/update', {
        customer
      })
    })
    .catch(err => {
      console.log(err)
    })
})

//update customer info
router.put('/update/:id', (req, res) => {

  var formData = req.body.customer
  Customer.findByIdAndUpdate(req.params.id, {
      name: formData.txtName,
      companyAddress: formData.txtAddress,
      contactPerson: formData.txtContactPerson,
      contactNo: formData.txtContactNo,
      email: formData.txtEmail
    })
    .then(() => res.redirect(`/customers`))
    .catch(err => console.log(err))

})

//delete/remove the customer
router.delete('/update/:id', (req, res) => {

  Customer.findByIdAndRemove(req.params.id)
    .then(() => res.redirect(`/customers`))
    .catch(err => console.log(err))

})


module.exports = router
