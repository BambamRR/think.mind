const express = require('express');
const exphbs = require('express-handlebars')

const app = express()

app.set('view engine', 'handlebars')
app.engine('handlebars', exphbs.engine())

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

app.use(express.static('public'))
