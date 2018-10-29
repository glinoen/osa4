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

const mostBlogs = (blogs) => {
  const kirjoittajat = blogs.map(x => x.author)
  let blogaajat = {}
  let counter = 0
  let ahkerin ={ author: '', blogs: '' }
  for(let i = 0; i < blogs.length; i++) {
    if(blogaajat[kirjoittajat[i]] === undefined) {
      blogaajat[kirjoittajat[i]] = 1
    } else {
      blogaajat[kirjoittajat[i]] = blogaajat[kirjoittajat[i]] +1
    }

    if(blogaajat[kirjoittajat[i]] > counter) {
      counter = blogaajat[kirjoittajat[i]]
      ahkerin = { author: kirjoittajat[i],
        blogs: counter }
    }
  }
  return ahkerin
}

const mostLikes = (blogs) => {
  const kirjoittajat = blogs.map(x => {
    return { author: x.author, likes: x.likes }})
  let blogaajat = []
  let counter = 0
  let ahkerin ={ author: '', likes: '' }
  for(let i = 0; i < blogs.length; i++) {
    if(blogaajat.filter(x => x.author === kirjoittajat[i].author).length === 0) {
      blogaajat = blogaajat.concat(kirjoittajat[i])
    } else {
      blogaajat[blogaajat.findIndex(x => x.author === kirjoittajat[i].author)] = { author: kirjoittajat[i].author,
        likes: blogaajat[blogaajat.findIndex(x => x.author === kirjoittajat[i].author)].likes + kirjoittajat[i].likes }
    }
    if(blogaajat[blogaajat.findIndex(x => x.author === kirjoittajat[i].author)].likes > counter) {
      counter = blogaajat[blogaajat.findIndex(x => x.author === kirjoittajat[i].author)].likes
      ahkerin = { author: kirjoittajat[i].author,
        likes: counter }
    }
  }
  return ahkerin
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes

}