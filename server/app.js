var express = require('express')
var session = require('express-session')

var path = require('path')
var logger = require('morgan')
var ueditor = require('ueditor')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

var db = require('./db.js')
var routes = require('./routes/index')
var user = require('./controller/user')

var app = express()
var router = express.Router()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(bodyParser.json({
  "limit": "50000kb"
}))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cookieParser())
app.use(session({
  name: 'admin.sid',
  resave: true,
  saveUninitialized: false,
  secret: 'keyboard cat'
}))

app.use(express.static(path.join(__dirname, '../public')))
app.use(express.static(path.join(__dirname, '../../blog-resource')))

app.get('/favicon.ico', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/favicon.ico'))
})

app.get('/login', function (req, res, next) {
  if (req.session.userid) {
    res.redirect('/home')
  }
  else {
    res.sendFile(path.join(__dirname, '../public/index.html'))
  }
})

app.get('/checkAuth', function (req, res, next) {
  if (req.session.userid) {
    res.redirect(`${req.query.url}`)
  } else {
    res.redirect('/login')
  }
})

app.get('/toLogin', user.toLogin)

app.get('/logout', function (req, res, next) {
  req.session.userid = null
  res.redirect('/login')
})

app.use(function (req, res, next) {
  if (req.session.userid) {
    next()
  } else {
    res.redirect('/login')
  }
})

app.use('/ueditor', ueditor(path.resolve(__dirname, "../../blog-resource"), function (req, res, next) {
  if (req.query.action === 'uploadimage') {
    let foo = req.ueditor,
        img_url = '/images/article'

    res.ue_up(img_url)
  }
  else if (req.query.action === 'listimage') {
    let dir_url = '/images/article'
    res.ue_list(dir_url)
  }
  else {
    res.setHeader('Content-Type', 'application/json')
    res.sendFile(path.join(__dirname, 'common/ueditor.config.json'))
  }
}))

app.use('/', routes)

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app