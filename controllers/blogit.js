const blogitRouter = require('express').Router()
const Blogi = require('../models/blogi')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const formatBlogi = (blogi) => {
  return {
    id: blogi._id,
    title: blogi.title,
    author: blogi.author,
    url: blogi.url,
    likes: blogi.likes,
    user: blogi.user
  }
}

blogitRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blogi
      .find({})
      .populate('user', { username: 1, name: 1 })
    response.json(blogs.map(formatBlogi))
  } catch(exception) {
    console.log(exception)
    response.status(500).json({ error: 'pilalla' })
  }
})

blogitRouter.post('/', async (request, response) => {
  try {
    const body = request.body


    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    let blog = new Blogi({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    if((blog.title === undefined || blog.title === null || blog.title === '') && (blog.url === undefined || blog.url === null || blog.url === '')){
      return response.status(400).json({ error: 'content missing' })
    }

    if(blog.likes === null || blog.likes === undefined || blog.likes === '') {
      blog.likes = 0
    }

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(formatBlogi(savedBlog))

  } catch (exception) {
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'pilalla' })
    }
  }
})

blogitRouter.delete('/:id', async (request, response) => {
  try{
    const blog = await Blogi.findById(request.params.id)

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(blog.user._id.toString() === decodedToken.id.toString()) {
      await Blogi.findByIdAndRemove(request.params.id)

      response.status(204).end()
    } else {
      response.status(401).json({ error: 'you are not authorized to remove this blog' })
    }

  }  catch (exception) {
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: 'you are not authorized to remove this blog' })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'pilalla' })
    }
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