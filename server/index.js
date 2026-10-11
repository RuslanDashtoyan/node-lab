import { createServer } from 'node:http'

const hostname = '127.0.0.1'
const port = Number(process.env.PORT ?? 3000)

const server = createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/hello') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Hello from Node.js Ruslan', node: process.version }))
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not found' }))
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
