import express from 'express'
import {
    getData,
    updateData,
    deleteData,
    insertData,
    countryCode,
    supplierData,
    distributorData
} from './licenceDevice.controller'
export const licenceDeviceRouter = express.Router();

licenceDeviceRouter.get("/getData",getData)
licenceDeviceRouter.post("/insertData",insertData)
licenceDeviceRouter.post("/updateData",updateData)
licenceDeviceRouter.post("/deleteData",deleteData)
licenceDeviceRouter.get("/countryCode",countryCode)
licenceDeviceRouter.get("/supplierData",supplierData)
licenceDeviceRouter.get("/distributorData",distributorData)
