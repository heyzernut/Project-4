const Category = require('../models/category')
const express = require('express')
const router = express.Router()


router.get('/new',(req, res) => {
  res.render('category/new')
})

//create a new category
router.post('/', (req, res) => {
  var formData = req.body.category

  var newCategory = new Category()
  newCategory.name = formData.txtName

  newCategory.save()
  .then(
    () => res.redirect(`/category`),
    err => res.send(err)
  )
})

//list all category
router.get('/',(req,res) => {
  Category.find()
  .then(category => {
    res.render(`category/view`, {
      category
    })
  })
  .catch(err => {
    console.log(err);
  })
})

router.get('/update/:id', (req,res) => {
  Category
  .findById(req.params.id)
  .then(category => {
    res.render('category/update', {
      category
    })
  })
  .catch(err => {
    console.log(err);
  })
})

//update the category
router.put('/update/:id', (req,res) => {
  var formData = req.body.category
  Category.findByIdAndUpdate(req.params.id, {
    name: formData.txtName
  })
  .then(() => res.redirect(`/category`))
  .catch(err => console.log(err))
})

//delete the category
router.delete('/update/:id', (req,res) => {

  Category.findByIdAndRemove(req.params.id)
  .then(() => res.redirect(`/category`))
  .catch(err => console.log(err))

})

module.exports = router
