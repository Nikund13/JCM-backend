import express from 'express'
import {userRouter} from './user'

export const restRouter = express.Router();


restRouter.use('/user',userRouter)
