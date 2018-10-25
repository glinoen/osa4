const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const blogitRouter = require('./controllers/blogit')


app.use(cors())
app.use(bodyParser.json())

morgan.token('tietoja', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :tietoja :status :res[content-length] - :response-time ms'))

app.use('/api/blogs', blogitRouter)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})