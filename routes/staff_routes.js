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

//get all staffs
router.get('/', (req, res) => {
  // the return of then
  Staff.find()
  .then(staffs => {
    res.render('staffs/view', {
      staffs
    })
  })
  .catch(err => {
    console.log(err)
  })
})

router.get('/update/:id', (req, res) => {

  Staff
    .findById(req.params.id)
    .populate("role")
    .then(staff => {
      res.render('staffs/update', {
        staff
      })
    })
    .catch(err => {
      console.log(err)
    })
})

router.put('/update/:id', (req, res) => {

  var formData = req.body.staff
  Staff
  .findByIdAndUpdate(req.params.id, {
      name: formData.txtName,
      role: formData.role,
      password: formData.txtPassword
    })
    .then(() => res.redirect(`/roles`))
    .catch(err => console.log(err))

})

module.exports = router
