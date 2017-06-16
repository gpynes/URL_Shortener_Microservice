// const restify = require('restify'),
const express = require('express'),
      fs = require('fs'),
      server = express()

let urls = {},
    id = 0


server.get('/', (req, res) => {
    res.write(fs.readFileSync(`${__dirname}/index.html`, 'utf-8'))
    res.end()
})

server.get('/:id', (req, res) => {
    const url = urls[req.params.id]

    if (url) {
        res.redirect(url)
        return
    }
    res.status(500)
    res.json({"error": "This url is not on the database."})
    return
})

const validUrl = new RegExp(/^(http:\/\/www\.|https:\/\/www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)

server.get('/new/*', (req, res) => {
  const url = req.params[0]
  if (!validUrl.test(url)) {
      res.status(500).json({error: 'Wrong url format, make sure you have a valid protocol and real site.'})
      return
  }
  if (!urls[url]) {
    urls[url] = id
    urls[id] = url
    id++
  }

  res.json({
    original_url: url,
    short_url:  `${req.hostname}/${urls[url]}`
  })
})

server.listen(process.env.PORT || 8080, () => console.log(`Server listening on port ${process.env.PORT || 8080}`))