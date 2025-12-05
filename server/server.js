import app from './express.js'
import config from './config/config.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, '../client/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'))
})

app.listen(config.port, (err) => {
  if (err) {
    console.error(err)
  }
  console.log(`Task Dash backend listening on port ${config.port}`)
})
