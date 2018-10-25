const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl)

const Blogi = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})
  
module.exports = Blogi