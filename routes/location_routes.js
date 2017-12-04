const express = require('express')
const router = express.Router()
const Location = require('../models/location')


router.get('/', (req, res) => {
  Location
.find()
.then(locations => {
  res.json({locations})
})
.catch(err => {
  console.log(err)
})

})

router.get('/new', (req, res) => {
  res.render('inventory/newLocation')
})

router.post('/new', (req, res) => {
    function range (start,stop) {
    var result=[]
    for (var idx= start.charCodeAt(0),end= stop.charCodeAt(0); idx <= end; idx++){
      result.push(String.fromCharCode(idx))
    }
    return result
  }

  function rangeNum (start,stop) {
  var result=[]
  for (var idx= start, end= stop; idx <= end; idx++){
    result.push(idx)
  }
  return result
}

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

module.exports = router
