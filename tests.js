const cp = require('child_process')
const http = require('http')
const assert = require('assert')
const expected = require('./data/products.json')
const server = cp.spawn(process.execPath, ['server.js'], { stdio: ['ignore', 'pipe', 'pipe'] })
const timeout = 7000
function requestOnce() {
  return new Promise((res, rej) => {
    http.get('http://127.0.0.1:3000/api/products', (r) => {
      let body = ''
      r.on('data', c => body += c)
      r.on('end', () => res({ statusCode: r.statusCode, body }))
    }).on('error', rej)
  })
}
function checkStructure(item) {
  assert(typeof item.id === 'number')
  assert(typeof item.name === 'string')
  assert(typeof item.price === 'number')
  assert(typeof item.image === 'string')
  assert(typeof item.description === 'string')
  assert(typeof item.rating === 'number')
  assert(item.rating >= 0 && item.rating <= 5)
  assert(typeof item.city === 'string')
  assert(typeof item.available === 'boolean')
  assert(Array.isArray(item.amenities))
}
(async () => {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    try {
      const { statusCode, body } = await requestOnce()
      if (statusCode === 200) {
        const data = JSON.parse(body)
        assert(Array.isArray(data))
        assert(data.length === expected.length)
        for (let i = 0; i < data.length; i++) {
          checkStructure(data[i])
        }
        for (let i = 0; i < data.length; i++) {
          const rnd = Math.floor(Math.random() * 500) + 30
          data[i].price = rnd
          assert(typeof data[i].price === 'number')
          assert(data[i].price >= 30 && data[i].price <= 529)
        }
        console.log('OK: Estructura verificada para', data.length, 'registros. Precios aleatorizados.')
        server.kill()
        process.exit(0)
      }
    } catch (e) {
      await new Promise(r => setTimeout(r, 200))
    }
  }
  console.error('Error: no se obtuvo respuesta del servidor en', timeout, 'ms')
  server.kill()
  process.exit(1)
})()
