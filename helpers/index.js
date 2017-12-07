// if user hasLoggedOut, but try to access routes that's not
//redirect ot home page
// if not let the routes run the actual logic
const isLoggedIn = (req, res, next) => {
  if(req.user) {
    res.redirect('/')
  } else {
    next()
  }
}

// the opposite of the function above
const hasLoggedOut = (req, res, next) => {
  if(req.user) {
    next()
  } else {
    res.redirect('/')
  }
}

const adminOrEmployee = (req, res, next) => {
  if(req.user.role.name === 'Admin' || req.user.role.name === 'Employee' ) {
    next()
  } else {
    res.redirect('/tracking')
  }
}

const adminOnly = (req, res, next) => {
  if(req.user.role.name === 'Admin') {
    next()
  } else if (req.user.role.name === 'Employee') {
    res.redirect('/')
  }
  else {
    res.redirect('/tracking')
  }
}

const employeeOnly = (req, res, next) => {
  if( req.user && req.user.role.name === 'DeliveryMan') {
    res.redirect('/tracking')
  } else {
    next()
  }
}

module.exports = {
  hasLoggedOut,
  isLoggedIn,
  adminOrEmployee,
  adminOnly,
  employeeOnly
}
