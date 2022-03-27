require('dotenv').config()
require('./database/db')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const flash = require('connect-flash')
const cookie = require('cookie-parser')
const path = require('path')

// Instatntiate
const app = express()

// Port
let port = process.env.PORT || 8000

// Paths
const view = path.join(__dirname, './templates/views')
const layout = path.join(__dirname, './templates/layouts/main.ejs')

// Body Parser & JSON
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// Template Engine
app.set('view engine', 'ejs')
app.set('views', view)

// Layout
app.use(expressLayouts)
app.set('layout', layout)

// Flash & Session
app.use(session({
    secret: "SecretIsOp",
    saveUninitialized: true,
    resave: true,
}))
app.use(flash())
app.use((req, res, next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.success_login = req.flash('success_login')
    res.locals.name = req.flash('name')

    next()
})
app.use(cookie("CookieIsOp"))


// Routes
app.use('/', require('./templates/routes/route'))

app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
})
