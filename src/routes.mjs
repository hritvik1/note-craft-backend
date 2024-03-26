import express from 'express'
import { UserController, NoteController } from './controllers/index.mjs'
import { UserModel, NoteModel } from './models/index.mjs'

export const Router = express.Router()

const userModel = new UserModel(),
      noteModel = new NoteModel()

const userController  = new UserController(userModel),
      noteController  = new NoteController(noteModel)
