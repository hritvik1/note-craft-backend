import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import http from 'node:http'
import { Router } from './src/routes.mjs'
import { DB } from './src/utils/index.mjs'

const app     = express(),
      server  = http.createServer(app),
      port    = process.env.PORT

app.set('port', port)
app.use(cors({
  exposedHeaders : ['x-access-token', 'x-refresh-token']                  // TODO - remove 'x-' from header name
}))
app.use(express.json())
app.use(express.urlencoded({ extended : false }))
app.use('/', Router)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

process.on('SIGINT', () => closeServer())
process.on('SIGTERM', () => closeServer())

function onError(err) {
  console.error('Server error: %s', err)
  closeServer()
}

function onListening() {
  console.info('Server listening on port %s', port)
}

async function closeServer() {
  await DB.close().then(() => console.info('Resources closed'))
  server.close().once('close', () => console.info('Server stopped'))
}
