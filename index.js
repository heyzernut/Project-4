require('dotenv').config({ silent: true })

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const moment = require('moment');

const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const cors = require('cors')

const passport = require('./config/ppConfig')
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
const Tracking = require('./models/tracking')
const Category = require('./models/category')
const FurnitureModel = require('./models/furnitureModel')

const app = express()

// require all my route files
const login_routes = require('./routes/login_routes')
const customer_routes = require('./routes/customer_routes')
const role_routes = require('./routes/role_routes')
const staff_routes = require('./routes/staff_routes')
const category_routes = require('./routes/category_routes')
const supplier_routes = require('./routes/supplier_routes')
const receivedstock_routes = require('./routes/receivedstock_routes')
const inventory_routes = require('./routes/inventory_routes')
const delivery_routes = require('./routes/delivery_routes')
const tracking_routes = require('./routes/tracking_routes')


// VIEW ENGINES aka handlebars setup
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// MIDDLEWARES
app.use(express.static(path.join(__dirname, 'public')))
app.use(function(req, res, next) {
  console.log('Method: ' + req.method + ' Path: ' + req.url)
  next()
})

// setup bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

//overwrite the delete request
app.use(function(req, res, next) {

  if (req.query._method == 'DELETE') {

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



// connecting to mongodb before we starting the server
mongoose.Promise = global.Promise
mongoose.connect(dbUrl, {
    useMongoClient: true
  })
  .then(
    () => {
      console.log('db is connected')
    },
    (err) => {
      console.log(err)
    }
  )

// MUST BE AFTER YOUR `mongoose.connect`
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}))

/// PASSPORT ACTIVATED
app.use(passport.initialize())
app.use(passport.session())

//furniture inventory json
app.get('/furnituremodel', (req,res)=>{
  FurnitureModel.find()
  .then((furniture)=>{
    res.json(furniture)
  })
})

// NEW ROUTE - Suppliers
app.use((req, res, next) => {
  app.locals.user = req.user
  if (req.user) {
    app.locals.admin = req.user.type === 'admin' ? req.user : null
  }
  next()
})


//homepage
app.get('/', (req, res) => {
  res.render('home')
})

//this is for logout
app.get('/logout', hasLoggedOut, (req, res) => {
  req.logout()
  res.redirect('/')
})

//register routes
app.use('/login', isLoggedIn, login_routes)
app.use('/location', location_routes)
app.use('/orders', delivery_routes)
app.use('/suppliers', supplier_routes)
app.use('/incomingstock', receivedstock_routes)
app.use('/location', location_routes)
app.use('/customers', customer_routes)
app.use('/roles', role_routes)
app.use('/staffs', staff_routes)
app.use('/category', category_routes)
app.use('/inventory', inventory_routes)
app.use('/tracking', tracking_routes)



// opening the port for express
app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})
