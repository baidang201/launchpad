import { createLogger } from 'bunyan'
import Koa from 'koa'
import { node }  from './config/index.js'
import index from "./routes/index.js"
import worker from './routes/workers.js'

globalThis.$logger = createLogger({
  level: 'info',
  name: 'dashboard'
})

const app = new Koa()

app.on('error', (err, ctx) => {
  $logger.error(err, ctx)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(worker.routes(), worker.allowedMethods())

$logger.info(`Listening on port ${node.HTTP_PORT}...`)
app.listen(node.HTTP_PORT)