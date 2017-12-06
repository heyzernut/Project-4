const Staff = require('../models/staff')
const Role = require('../models/role')
const express = require('express')
const router = express.Router()

router.get('/new', (req, res) => {
  Role.find()
  .then((role)=>{
    res.render('staffs/new', {role})
  })
  .catch(err => {
    console.log(err)
  })
})

router.post('/', (req, res, next) => {

  var formData = req.body.staff

  var newStaff = new Staff()
  newStaff.name = formData.txtName
  newStaff.password = formData.txtPassword
  newStaff.role = formData.role

  newStaff.save()
  .then(
    () => res.redirect('/staffs'),
    err => res.send(err)
  )

})




module.exports = router
