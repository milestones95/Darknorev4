const express = require('express')
const next = require('next')
const { createProxyMiddleware } = require("http-proxy-middleware")

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev: true })
const handle = app.getRequestHandler()

const apiPaths = {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true
  },
}

const isDevelopment = process.env.NODE_ENV !== 'production'

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
}).catch(err => {
  console.log('client - server.js app.prepare error:', err)
})