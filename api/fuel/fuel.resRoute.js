import express from 'express'
import {
    stationData,
    companyData,
    countryData,
    fuelData,
    priceData,
    insertPriceData
} from './fuel.controller'
export const fuelRouter = express.Router();

fuelRouter.get("/countryData",countryData)
fuelRouter.get("/companyData",companyData)
fuelRouter.get("/stationData",stationData)
fuelRouter.get("/fuelData",fuelData)
fuelRouter.get("/priceData",priceData)
fuelRouter.post("/insertPriceData",insertPriceData)

