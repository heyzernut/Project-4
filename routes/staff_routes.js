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
  .populate('role')
  .then(staffs => {
    // console.log()
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
    .populate('role')
    .then(staff => {
      Role.find()
      .then((role) => {
        const selected = staff.role
        const filteredRole = role.filter((e) => e.name !== selected.name)
        res.render('staffs/update', {staff, role: filteredRole, selected})
      })
    })
    .catch(err => {
      console.log(err)
    })
})

router.put('/update/:id', (req, res) => {
  // console.log('Updating PW!! :, ', req.body.staff)
  var formData = req.body.staff
  Staff.findById(req.params.id)
    .populate('role')
    .then((user) => {
      console.log('from the form:', formData.role)
      Role.find({name: formData.role})
        .then((role) => {
          // console.log('role : ',role)
          // console.log(role[0].name);
          user.set({
            role: role[0]._id,
            name: formData.txtName,
            password: formData.txtPassword
          })
          user.save()
          .then(
            (updatedUser) => res.redirect(`/staffs`),
            (err) => res.send(err)
          )
        })

    })

})

// Detele file
router.delete('/update/:id', (req, res) => {

  Staff.findByIdAndRemove(req.params.id)
  .then(() => res.redirect(`/staffs`))
  .catch(err => console.log(err))
})

module.exports = router
