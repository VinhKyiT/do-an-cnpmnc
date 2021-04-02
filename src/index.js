const express = require('express');
const pug = require('pug');
const path = require('path');

const app = express();
const port = 4000;

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'resources/views'))

app.get('/', (req, res) =>{
    res.render('./layouts/main');
})

app.get('/news', (req, res) =>{
    res.render('news');
})

app.listen(port, () => console.log(`listening on port ${port}`))