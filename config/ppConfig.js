const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/staff')

passport.serializeUser((user, next) => {
  console.log('serializeUser', user)
  next(null, user.id)
})

passport.deserializeUser((id, next) => {
  console.log('==> id :', id)
  User.findById(id)
    .populate('role')
    .then((user) => {
      return next(null, user)
    })
    .catch((err) => next(err, null))
})

passport.use(new LocalStrategy({
  usernameField: 'user[txtName]',
  passwordField: 'user[txtPassword]'
}, (name, password, next) => {

  User.findOne({name: name})
  .then(user => {
    if (!user) return next(null, false)

    user.validPassword(password, (err, isMatch) => {
      console.log('password validating')
      if (err) return next(err)
      if (isMatch) {
        console.log('matched')
        return next(null, user)
      }
      console.log('pw is not matched')
      return next(null, false, { message: 'mismatched'})
    })
  })
  .catch(err => next(err))
}))

module.exports = passport
