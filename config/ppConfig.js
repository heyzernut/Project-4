
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// need to require `User` model here, so we can access the db
const Customer = require('../models/customer')
const Admin = require('../models/staff')

// Passport general pseudocode
// POST to /login
// if successful
// passport will call `serializeUser()` to store into the SESSION => `user.id`
// and express-session will hash the session data into the COOKIE

// The next time user made another request ALONG WITH THE COOKIE
// passport will `deserializeUser()` aka comparing HASHED cookie with PLAIN SESSION
// if both have the same `user.id`, then the current request is authorized => user has logged in here before

// NOTICE, there's a repeat of `next()` keyword there
// the easiest to think about it, `next()` will call what happened NEXT AFTER
// THE PREVIOUS STEPS
// `next()` takes two argument, `err` object and `user` object

// STEPS are
// 1. login => post to passport
// 2. passport run local strategy => user model check
// 3. if cannot find user, call `next()` with NULL `err` but FALSE `user`
// 4. if can find user, call `next()` with NULL `err` and  found `user` obj
// 5. if login failed somehow, call `next()` with an `err` object

//use `next` and `=>` for consistency
passport.serializeUser((user, next) => {
  const userInfo = {
    id: user.id,
    type: user.type
  }
  next(null, userInfo) // this user with specific id. has logged in before
})

passport.deserializeUser((userInfo, next) => {
  if (userInfo.type === 'customer') {
    Customer.findById(userInfo.id, function (err, user) {
      return next(err, user)
    })
  }
  if (userInfo.type === 'admin') {
    Admin.findById(userInfo.id, function (err, user) {
      return next(err, user)
    })
  }
})

// THIS IS THE SETUP FOR LOCAL STRATEGY IN PASSPORT
// as you see local strategy only need two things
// `usernameField` and `passwordField`
// but we don't use `username`, hence we have to specifically change this based
// the form name. SPLIT WITH `users/login.handlebars` for better understanding
passport.use(new LocalStrategy({
  usernameField: 'user[txtEmail]', // this is from <input name="user[email]">
  passwordField: 'user[txtPassword]', // this is from <input name="user[password]">
  passReqToCallback: true
}, function (req, email, password, next) {
 // update after class 23 oct, use `=>`, and `next`
  // update after 23 oct, we use then

  const Collection = req.body.user.type === 'admin' ? Admin : Customer

  Collection.findOne({email: email})
  .then(user => {

    // if cannot find user, then we call `next()`
    if (!user) return next(null, false)

    // to easily understand this part, SPLIT with `user.js` line 50
    // `user.validPassword()` takes two argument. plainPassword and callback
    user.validPassword(password, (err, isMatch) => {
      if (err) return next(err)
      if (isMatch) {
        return next(null, user)
      }
      return next(null, false, { message: 'mismatched'})
    })
  })
  .catch(err => next(err))
}))

module.exports = passport
