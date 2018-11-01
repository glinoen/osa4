const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blogi = require('../models/blogi')
const { initialBlogs, blogsDb } = require('./test_helper')


beforeAll(async () => {
  await Blogi.remove({})
  for (let blog of initialBlogs) {
    let blogi = new Blogi(blog)
    await blogi.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api
    .get('/api/blogs')

  expect(response.body.length).toBe(initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api
    .get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(titles).toContain('Go To Statement Considered Harmful')
})

test('posting new blog', async () => {
  const blogitAlussa = await blogsDb()
  const blog = new Blogi({
    title: 'juhuuu',
    author: 'herbertti',
    url: 'www.herbert.info',
    likes: 60
  })

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogitPost = await blogsDb()

  expect(blogitPost.length).toBe(blogitAlussa.length +1)

  const blogit = blogitPost.map(x => x.title)

  expect(blogit).toContain('juhuuu')
})

test('posting blog with no likes', async () => {
  const alkutila = await blogsDb()

  const blog = new Blogi({
    title: 'juhuuu',
    author: 'herbertti',
    url: 'www.herbert.info',
    likes: ''
  })

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const jalkitila = await blogsDb()

  expect(jalkitila.length).toBe(alkutila.length +1)
  expect(jalkitila[alkutila.length].likes).toBe(0)
})

test('posting blog with no title and no url', async () => {
  const alkutila = await blogsDb()

  const blog = new Blogi({
    title: undefined,
    author: 'herbertti',
    url: undefined,
    likes: ''
  })

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(400)

  const jalkitila = await blogsDb()

  expect(jalkitila.length).toBe(alkutila.length)
})

test('deleting blog', async () => {
  const alkutila = await blogsDb()
  await api
    .del('/api/blogs/5a422aa71b54a676234d17f8')
    .expect(204)

  const jalkitila = await blogsDb()

  expect(jalkitila.length).toBe(alkutila.length - 1)
})

test('updating blog', async () => {
  const alkutila = await blogsDb()

  const blog = new Blogi({
    title: 'versio 1.1',
    author: 'herbertti',
    url: 'undefined',
    likes: 55
  })
  await api
    .put('/api/blogs/5a422a851b54a676234d17f7')
    .send(blog)
    .expect(200)

  const jalkitila = await blogsDb()

  expect(jalkitila.length).toBe(alkutila.length)

  const blogit = jalkitila.map(x => x.title)

  expect(blogit).toContain('versio 1.1')
})

afterAll(() => {
  server.close()
})