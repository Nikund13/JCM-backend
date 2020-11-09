import express from 'express'
import {userRouter} from './user'
import {licenceStationRouter} from './licenceStation'
import { licenceDeviceRouter } from './licenceDevice';
import { fuelRouter } from './fuel/fuel.resRoute';
import { tankRouter } from './tank';
import { customerNamesRouter } from './customerNames';
import {barcodeRouter} from './barcode'

export const restRouter = express.Router();

restRouter.use('/user',userRouter)
restRouter.use('/licenceStation',licenceStationRouter)
restRouter.use('/licenceDevice',licenceDeviceRouter)
restRouter.use('/fuel',fuelRouter)
restRouter.use('/tank',tankRouter)
restRouter.use('/customerNames',customerNamesRouter)
restRouter.use('/barcode',barcodeRouter)
