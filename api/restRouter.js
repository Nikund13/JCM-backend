import express from 'express'
import {userRouter} from './user'
import {licenceStationRouter} from './licenceStation'
import { licenceDeviceRouter } from './licenceDevice';
import { fuelRouter } from './fuel/fuel.resRoute';

export const restRouter = express.Router();

restRouter.use('/user',userRouter)
restRouter.use('/licenceStation',licenceStationRouter)
restRouter.use('/licenceDevice',licenceDeviceRouter)
restRouter.use('/fuel',fuelRouter)
