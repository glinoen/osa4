const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const { usersDb } = require('./test_helper')

beforeAll(async () => {
  await User.remove({})
  const user = new User({
    username: 'perusucco',
    password: 'sekretty',
    name: 'pertti',
    adult: true })
  await user.save()
})

test('POST /api/users succeeds with a fresh username', async () => {
  const usersEnnen = await usersDb()

  const newUser = {
    username: 'freshman',
    name: 'Tuore Henkilö',
    password: '0000',
    adult: true
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const usersJalkeen = await usersDb()
  expect(usersJalkeen.length).toBe(usersEnnen.length+1)
  const usernames = usersJalkeen.map(u => u.username)
  expect(usernames).toContain(newUser.username)
})

test('username already taken', async () => {
  const usersEnnen = await usersDb()

  const newUser = {
    username: 'perusucco',
    name: 'pernilla',
    password: 'salainen',
    adult: true
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body).toEqual({ error: 'username already taken' })

  const usersJalkeen = await usersDb()
  expect(usersJalkeen.length).toBe(usersEnnen.length)
})

test('password too short', async () => {
  const usersEnnen = await usersDb()

  const newUser = {
    username: 'flymen',
    name: 'pernilla',
    password: 'sa',
    adult: true
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body).toEqual({ error: 'password too short' })

  const usersJalkeen = await usersDb()
  expect(usersJalkeen.length).toBe(usersEnnen.length)
})

afterAll(() => {
  server.close()
})