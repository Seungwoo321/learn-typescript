const path = require('path')
const dotenv = require('dotenv')
dotenv.config(path.resolve('.env'))

const app = require('./app')
const http = require('http')
const PORT = process.env.PORT || '3000'
const server = http.createServer(app.callback())

server.listen(PORT)

server.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
