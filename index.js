const express = require('express');
const app = express();
const port = 4000;
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var route = require('./routes/index.route');
require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/kttstore', { useNewUrlParser: true, useUnifiedTopology: true });

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

app.listen(port, () => console.log(`listening on port ${port}`))