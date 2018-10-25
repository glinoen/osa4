const blogitRouter = require('express').Router()
const Blogi = require('../models/blogi')

const formatBlogi = (blogi) => {
  return {
    id: blogi._id,
    title: blogi.title,
    author: blogi.author,
    url: blogi.url,
    likes: blogi.likes
  }
}

blogitRouter.get('/', (request, response) => {
  Blogi
    .find({})
    .then(blogs => {
      response.json(blogs.map(formatBlogi))
    })
})

blogitRouter.post('/', (request, response) => {
  const blog = new Blogi(request.body)

  blog
    .save()
    .then(result => {
      return formatBlogi(result)
    })
    .then(formatoituBlogi => {
      response.json(formatoituBlogi)
    })
})

module.exports = blogitRouter