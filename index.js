const express = require('express');
const app = express();
const port = 4000;
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var route = require('./routes/index.route');
var session = require('express-session')
var cors = require('cors')
var paypal = require('paypal-rest-sdk')
require('dotenv').config();

app.use(cors())

mongoose.connect('mongodb://localhost:27017/kttstore', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }))

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    next();
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(cookieParser(process.env.SESSION_SECRET));

var sessionMiddleware = require('./middlewares/session.middleware');
var authMiddleware = require('./middlewares/auth.middleware');


app.set('view engine', 'pug');
app.set('views', './views');

app.use(sessionMiddleware);
app.use(authMiddleware);

app.get('/', (req, res) => {
    res.redirect('/home')
});

route(app);

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: "AUCa4pobMjYD9BCsDsB2j3u9fWmU-ERk7bl8FMjLzYBsB2QvjPWl82T4gcoObuNomvf2A_PYxW36KfM6",
  client_secret: "EJHUGgvIFPzangKJjESueYC-c8hvw223p1XJAPc4QFgXVpUElDFTmbWvkfAWwtP5DzR8QHLdb53jxqIG",
});


app.listen(port);