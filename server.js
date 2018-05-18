const path = require('path')
const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')

const app = express()
app.use(helmet())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

const nunjucks = require('nunjucks')
nunjucks.configure('./', {
  autoescape: true,
  express: app
})

app.set('views', path.join(__dirname, './'))
app.get('/', (req, res) => {
  res.render('index.njk', {
    title: 'webper'
  })
})

app.use(express.static('./dist'))

app.get('/', require('./routes/index'))
app.post('/api/cwebp', require('./routes/api/cwebp').post)

const port = process.env.PORT || 5000

app.listen(port, function() {
  console.log('Server running at http://localhost:' + port)
})
