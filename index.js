const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const blogitRouter = require('./controllers/blogit')
const config = require('./utils/config')
const mongoose = require('mongoose')
const http = require('http')
const usersRouter = require('./controllers/users')

mongoose
  .connect(config.mongoUrl,{ useNewUrlParser: true })
  .then( () => {
    console.log('connected to database', config.mongoUrl)
  })
  .catch( err => {
    console.log(err)
  })

app.use(cors())
app.use(bodyParser.json())

morgan.token('tietoja', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :tietoja :status :res[content-length] - :response-time ms'))

app.use('/api/blogs', blogitRouter)
app.use('/api/users', usersRouter)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app,
  server
}

