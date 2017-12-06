require('dotenv').config({ silent: true })

// installing all modules
const express = require('express')
const mongoose = require('mongoose') // for DB
const path = require('path') // for Public files
const exphbs = require('express-handlebars') // for Handlebars
const bodyParser = require('body-parser') // for accessing POST request
const methodOverride = require('method-override') // for accessing PUT / DELETE
const moment = require('moment');

const session = require('express-session') // to create session and cookies
const MongoStore = require('connect-mongo')(session) // to store session into db
const cors = require('cors')

const passport = require('./config/ppConfig') // to register passport strategies
const { hasLoggedOut, isLoggedIn } = require('./helpers')
const helpers = require('handlebars-helpers')();


// Models
const Location = require('./models/location')
const location_routes = require('./routes/location_routes')
const Customer = require('./models/customer')
const Role = require('./models/role')
const Staff = require('./models/staff')
const Supplier = require('./models/supplier')
const ReceivedStock = require('./models/receivedStock')

const app = express()


// require all my route files
const customer_routes = require('./routes/customer_routes')
const role_routes = require('./routes/role_routes')
const staff_routes = require('./routes/staff_routes')
const supplier_routes = require('./routes/supplier_routes')
const receivedstock_routes = require('./routes/receivedstock_routes')
const inventory_routes = require('./routes/inventory_routes')

// VIEW ENGINES aka handlebars setup
app.engine('handlebars', exphbs({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// MIDDLEWARES
app.use(express.static(path.join(__dirname, 'public')))
app.use(function (req, res, next) {
  console.log('Method: ' + req.method + ' Path: ' + req.url)
  next()
})

// setup bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

//overwrite the delete request
app.use( function( req, res, next ) {
    // this middleware will call for each requested
    // and we checked for the requested query properties
    // if _method was existed
    // then we know, clients need to call DELETE request instead
    if ( req.query._method == 'DELETE' ) {
        // change the original METHOD
        // into DELETE method
        req.method = 'DELETE';
        // and set requested url to /user/12
        req.url = req.path;
    }
    next();
});

// setup methodOverride
app.use(methodOverride('_method'))

//MongoDB files
const dbUrl = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost/project4'
const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 5100 // this is for our express server

/// PASSPORT ACTIVATED
app.use(passport.initialize())
app.use(passport.session())

// connecting to mongodb before we starting the server
mongoose.Promise = global.Promise
mongoose.connect(dbUrl, {
  useMongoClient: true
})
.then(
  () => { console.log('db is connected') },
  (err) => { console.log(err) }
)

// MUST BE AFTER YOUR `mongoose.connect`
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  // store this to our db too
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

//homepage
app.get('/',(req,res) => {
  res.render('home')
})


// NEW ROUTE - Suppliers
app.use((req, res, next) => {
  app.locals.user = req.user
  if (req.user) {
    app.locals.admin = req.user.type === 'admin' ? req.user : null
  }
  // app.locals.admin  // we'll only `req.user` if we managed to log in
  next()
})
//routes
const delivery_routes = require('./routes/delivery_routes')

//register routes
app.use('/location', location_routes)
app.use('/orders', delivery_routes)
app.use('/suppliers', supplier_routes)
app.use('/incomingstock', receivedstock_routes)
app.use('/location', location_routes)
app.use('/customers', customer_routes)
app.use('/roles', role_routes)
app.use('/staffs', staff_routes)
app.use('/inventory', inventory_routes)

//homepage
// app.get('/',(req,res) => {
//   console.log('enter')
//   res.render('home')
// })

// opening the port for express
app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})
