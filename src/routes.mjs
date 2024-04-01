import express from 'express'
import { CommonUtils, ErrorResponses } from './utils/index.mjs'
import { UserController, NoteController } from './controllers/index.mjs'
import { UserModel, NoteModel } from './models/index.mjs'

export const Router = express.Router()

Router.use((req, res, next) => {
  if(!Router.stack.some(layer => layer.route && layer.route.path === req.path)) {
    CommonUtils.sendErrorResponse(res, ErrorResponses.message.API_ENDPOINT_NOT_FOUND,
                                  ErrorResponses.name.NOT_FOUND_ERROR, 404)
    return next()
  }
})

const userModel = new UserModel(),
      noteModel = new NoteModel()

const userController  = new UserController(userModel),
      noteController  = new NoteController(noteModel)

Router.get('/test', (req, res) => {
  res.send('Hello World!')
})
