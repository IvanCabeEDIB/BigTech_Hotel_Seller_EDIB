const path = require('path')
const fs = require('fs')
const Fastify = require('fastify')
const products = require('./data/products.json')
const fastify = Fastify()
fastify.get('/api/products', async () => {
  return products.map(p => {
    const item = Object.assign({}, p)
    return item
  })
})
fastify.get('/*', async (request, reply) => {
  const reqPath = request.params['*'] || ''
  const filePath = path.join(__dirname, 'public', reqPath || 'index.html')
  if (!fs.existsSync(filePath)) {
    reply.code(404).type('text/plain').send('Not found')
    return
  }
  const ext = path.extname(filePath).slice(1)
  const mimeTypes = { html: 'text/html', js: 'application/javascript', css: 'text/css', json: 'application/json', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml' }
  const type = mimeTypes[ext] || 'application/octet-stream'
  const data = fs.readFileSync(filePath)
  reply.type(type).send(data)
})
const start = async () => {
  await fastify.listen({ port: 3000, host: '0.0.0.0' })
}
start()
