import express from 'express'
import { VerifyAuthToken } from './auth.mjs'
import { CommonUtils } from './utils/index.mjs'
import { UserController, NoteController } from './controllers/index.mjs'
import { UserModel, NoteModel } from './models/index.mjs'

export const Router = express.Router()

Router.use((req, res, next) => {
  if(!Router.stack.some(layer => layer.route && layer.route.path === req.path)) {
    CommonUtils.sendErrorResponse(res, {
      name    : 'NotFoundError',
      message : 'The requested API endpoint was not found.',
      code    : 404
    })
    return next()
  }

  VerifyAuthToken(req, res, next)
})

const userModel = new UserModel(),
      noteModel = new NoteModel()

const userController  = new UserController(userModel),
      noteController  = new NoteController(noteModel)

Router.get('/test', (req, res) => {
  res.send('Hello World!')
})
