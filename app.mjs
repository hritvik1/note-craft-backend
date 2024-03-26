import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import http from 'node:http'
import { Router } from './src/routes.mjs'
import { CommonUtils, DB } from './src/utils/index.mjs'

const app     = express(),
      server  = http.createServer(app),
      port    = process.env.PORT

app.set('port', port)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended : false }))
app.use('/', Router)
app.use((req, res) => CommonUtils.sendErrorResponse(res, 'NOT_FOUND', 404))

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

process.on('SIGINT', () => closeServer())
process.on('SIGTERM', () => closeServer())

function onError(err) {
  console.error('Server Error: %s', err)
  closeServer()
}

function onListening() {
  console.info('Server listening: %s', port)
}

async function closeServer() {
  await DB.close().then(() => console.info('Resources closed'))
  server.close().once('close', () => console.info('Server stopped'))
}
