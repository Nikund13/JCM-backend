import express from 'express'
import {userRouter} from './user'
import {licenceStationRouter} from './licenceStation'

export const restRouter = express.Router();

restRouter.use('/user',userRouter)
restRouter.use('/licenceStation',licenceStationRouter)
