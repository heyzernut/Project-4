const Role = require('../models/role')
const express = require('express')
const router = express.Router()

router.get('/new', (req,res) => {
  res.render('roles/new')
})

//create the new role
router.post('/', (req, res) => {
  var formData = req.body.role

  var newRole = new Role()
  newRole.name = formData.txtRole

  newRole.save()
  .then(
    () => res.redirect(`/roles`),
    err => res.send(err)
  )
})

//get all the roles
router.get('/', (req,res) => {
  Role.find()
  .then(roles => {
    res.render('roles/view',{
      roles
    })
  })
  .catch(err => {
    console.log(err);
  })
})

router.get('/update/:id', (req, res) => {

  Role
    .findById(req.params.id)
    .then(role => {
      res.render('roles/update', {
        role
      })
    })
    .catch(err => {
      console.log(err)
    })
})

router.put('/update/:id', (req, res) => {

  var formData = req.body.role
  Role.findByIdAndUpdate(req.params.id, {
      name: formData.txtRole
    })
    .then(() => res.redirect(`/roles`))
    .catch(err => console.log(err))

})

router.delete('/update/:id', (req, res) => {

  Role.findByIdAndRemove(req.params.id)
    .then(() => res.redirect(`/roles`))
    .catch(err => console.log(err))

})

module.exports = router
