const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const liket = blogs.map(x => x.likes).reduce((a, b) => a + b, 0)
  return liket
}

const favoriteBlog = (blogs) => {
  const liket = blogs.map(x => x.likes)
  const mostlikes = Math.max(...liket)
  const mostliked = blogs.filter(x => x.likes === mostlikes)
  return mostliked
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}