// require('dotenv').config()

const express = require('express')
const app = express()
var cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))
var corsOptions = {
	origin: '*',
}

app.use(cors(corsOptions))
app.use(express.json())

const usersRouter = require('./routes/users')
const productsRouter = require('./routes/products')
app.use('/users', usersRouter)
app.use('/users', productsRouter)

app.listen(process.env.PORT, () => console.log('Server Started'))
