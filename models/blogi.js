const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const mongoUrl = process.env.MONGODB_URI

mongoose
  .connect(mongoUrl, { useNewUrlParser: true })
  .then( () => {
    console.log('connected to database')
  })
  .catch( err => {
    console.log(err)
  })

const Blogi = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = Blogi