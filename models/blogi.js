const mongoose = require('mongoose')



const Blogi = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = Blogi