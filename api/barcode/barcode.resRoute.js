import express from 'express'
// import { licenceDeviceRouter } from '../licenceDevice/licenceDevice.resRoute';
import {
    getData,
    updateData,
    deleteData,
    insertData,
    getcustomerdata,
    getfuelname
} from './barcode.controller'
export const barcodeRouter = express.Router();

barcodeRouter.get("/getData",getData)
barcodeRouter.post("/insertData",insertData)
barcodeRouter.post("/updateData",updateData)
barcodeRouter.post("/deleteData",deleteData)
barcodeRouter.get('/getcustomerdata',getcustomerdata)
barcodeRouter.get('/getfuelname',getfuelname)