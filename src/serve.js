import { serve } from 'bun'

const port = 8000
const root = './src'

serve({
  port,
  async fetch(req) {
    const url = new URL(req.url)
    let filePath = root + url.pathname

    if (url.pathname === '/') {
      filePath = root + '/index.html'
    }

    try {
      const file = Bun.file(filePath)
      const exists = await file.exists()
      if (!exists) {
        return new Response('Not Found', { status: 404 })
      }
      return new Response(file)
    } catch (err) {
      return new Response('Internal Server Error', { status: 500 })
    }
  }
})

console.log(`Server running on http://localhost:${port}`)
