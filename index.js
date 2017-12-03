require('dotenv').config({ silent: true })

// installing all modules
const express = require('express')
const mongoose = require('mongoose') // for DB
const path = require('path') // for Public files
const exphbs = require('express-handlebars') // for Handlebars
const bodyParser = require('body-parser') // for accessing POST request
const methodOverride = require('method-override') // for accessing PUT / DELETE


const session = require('express-session') // to create session and cookies
const MongoStore = require('connect-mongo')(session) // to store session into db
// const passport = require('./config/ppConfig') // to register passport strategies
// const { hasLoggedOut, isLoggedIn } = require('./helpers')

// Models
const Customer = require('./models/customer')


const app = express()


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
// setup methodOverride
app.use(methodOverride('_method'))

//MongoDB files
const dbUrl = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost/project4'
const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 4000 // this is for our express server

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


// opening the port for express
app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})

app.get('/',(req,res) => {
  res.render('home')
})

app.use('/inventories', inventory_routes)
