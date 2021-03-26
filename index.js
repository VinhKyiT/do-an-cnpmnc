const express = require('express')
const app = new express()
const path = require('path')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/mobilestore-db', {useNewUrlParser = true})

const ejs = require('ejs')
app.set('view engine', 'ejs')

//Đăng ký thư mục public.
app.use(express.static('public'))

app.listen(3000, () => {
    console.log('App listening on port 3000')
})


app.get('/', (request, response) => {
    response.render('index')
})

app.get('/about', (request, response) => {
    response.render('about');
})
app.get('/contact', (request, response) => {
    response.render('contact');
})
app.get('/post', (request, response) => {
    response.render('post')
})