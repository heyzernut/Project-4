// require the model here
const Staff = require('../models/staff')
const express = require('express')
const router = express.Router()

const passport = require('../config/ppConfig')

router.get('/', (req, res) => {
  res.render('login/login')
})

router.post('/', (req, res, next) => {
  passport.authenticate('local',  function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log('user logined', user)
      return res.redirect('/');
    });
  })(req, res, next)
})

module.exports = router
