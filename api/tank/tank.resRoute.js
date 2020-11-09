import express from 'express'
import {
    gettankdata,
    getcompanyData,
    tankstationData,
    tankFuelData,
    getprevMonthdata,
    dispenserSaleData,
    blacklistFilter,
    getSummarydata
} from './tank.controller'
export const tankRouter = express.Router();


tankRouter.get("/gettankdata",gettankdata)
tankRouter.get("/getcompanyData",getcompanyData)
tankRouter.get("/tankstationData",tankstationData)
tankRouter.get("/tankFuelData",tankFuelData)
tankRouter.get("/getprevMonthdata",getprevMonthdata)
tankRouter.get("/getSummarydata",getSummarydata)
tankRouter.get("/dispenserSale",dispenserSaleData)
tankRouter.get('/blacklistFilter',blacklistFilter)
