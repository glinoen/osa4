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

blogitRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blogi.find({})
    response.json(blogs.map(formatBlogi))
  } catch(exception) {
    console.log(exception)
    response.status(500).json({ error: 'pilalla' })
  }
})

blogitRouter.post('/', async (request, response) => {
  try {
    let blog = new Blogi(request.body)

    if((blog.title === undefined || blog.title === null || blog.title === '') && (blog.url === undefined || blog.url === null || blog.url === '')){
      return response.status(400).json({ error: 'content missing' })
    }

    if(blog.likes === null || blog.likes === undefined || blog.likes === '') {
      blog.likes = 0
    }

    const savedBlog = await blog.save()
    response.json(formatBlogi(savedBlog))

  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'pilalla' })
  }
})

blogitRouter.delete('/:id', async (request, response) => {
  try{
    await Blogi.findByIdAndRemove(request.params.id)

    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

blogitRouter.put('/:id', async (request,response) => {
  try {
    const blog = new Blogi(request.body)

    const updatedBlog = await Blogi.findByIdAndUpdate(request.params.id,{ $set: { title: blog.title, author: blog.author, url: blog.url, likes: blog.likes } }, { new: true })

    response.json(formatBlogi(updatedBlog))
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = blogitRouter