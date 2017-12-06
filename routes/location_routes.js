const express = require('express')
const router = express.Router()
const Location = require('../models/location')

function rangeNum (start,stop) {
  var result=[]
  for (var idx= start , end= stop; idx <=end; idx++){
    result.push(idx)
  }
  return result
}

function range (start,stop) {
  var result=[]
  for (var idx= start.charCodeAt(0),end= stop.charCodeAt(0); idx <=end; ++idx){
    result.push(String.fromCharCode(idx))
  }
  return result
}



router.get('/', (req, res) => {
  Location
  .find()
  .then(locations => {
    res.render('inventory/location', {
      locations
    })
  })
  .catch(err => {
    console.log(err)
  })
})

router.get('/new', (req, res) => {
  res.render('inventory/newLocation')
})

router.post('/new', (req, res) => {
  var newLocation = new Location({
    address: req.body.address,
    type: req.body.type,
    zone: range(req.body.zone_start,req.body.zone_stop),
    shelf: rangeNum(req.body.shelf_start,req.body.shelf_stop)
  })
  newLocation.save()
  .then(
    () => res.redirect('/location'),
    err => res.send(err)
  )
})

router.get('/:id', (req, res) => {
  var id = req.params.id
  Location.findOne({_id: id})
  .then(location => {
    res.render('inventory/locationId', {
      location
    })
  })
  .catch(err => {
    console.log(err)
  })
})

router.put('/:id', (req, res) => {
  var formData = req.body
  Location.findByIdAndUpdate(req.params.id, {
    address: formData.address,
    location: formData.location,
    zone: range(formData.zone_start,formData.zone_stop),
    shelf: rangeNum(formData.shelf_start,formData.shelf_stop)
  })
  .then(() => res.redirect(`/location`))
  .catch(err => console.log(err))
})

router.delete('/:id', (req, res) => {
  Location.findByIdAndRemove(req.params.id)
  .then(() => res.redirect('/location'))
  .catch(err => console.log(err))
})


module.exports = router
