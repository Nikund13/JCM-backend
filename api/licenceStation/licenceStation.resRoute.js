import express from 'express'
import {
    getData,
    updateData,
    deleteData,
    insertData,
    getCompanyId,
    getStationDetail,
    getDispenserDetail,
    getCompanyData
} from './licenceStation.controller'
export const licenceStationRouter = express.Router();

licenceStationRouter.get("/getData",getData)
licenceStationRouter.post("/insertData",insertData)
licenceStationRouter.post("/updateData",updateData)
licenceStationRouter.post("/deleteData",deleteData)
licenceStationRouter.get("/getCompanyId",getCompanyId)
licenceStationRouter.get("/getStationDetail",getStationDetail)
licenceStationRouter.get("/getDispenserDetail",getDispenserDetail)
licenceStationRouter.get("/getCompanyData",getCompanyData)
