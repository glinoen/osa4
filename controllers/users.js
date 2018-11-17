const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const formatUser = (user) => {
  return {
    id: user._id,
    username: user.username,
    name: user.name,
    adult: user.adult,
    blogs: user.blogs
  }
}

usersRouter.post('/', async (request,response) => {
  try{
    const body = request.body

    const existingUser = await User.find({ username: body.username })
    if (existingUser.length>0) {
      return response.status(400).json({ error: 'username already taken' })
    }

    if (body.password.length < 3) {
      return response.status(400).json({ error: 'password too short' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User ({
      username: body.username,
      name: body.name,
      adult: body.adult,
      passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'pilalla...' })
  }
})

usersRouter.get('/', async (request,response) => {
  try{
    const users = await User
      .find({})
      .populate('blogs', { author: 1, title: 1, url: 1, likes: 1 })
    response.json(users.map(formatUser))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'pilalla...' })
  }
})

module.exports = usersRouter