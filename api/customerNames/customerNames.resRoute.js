import express from 'express'
import {
    getData,
    updateData,
    deleteData,
    insertData,
    customer_type_Data,
    web_user_type,
    limit_type,
    customer_discount_type

} from './customerNames.controller'
export const customerNamesRouter = express.Router();

customerNamesRouter.get("/getData",getData)
customerNamesRouter.post("/insertData",insertData)
customerNamesRouter.post("/updateData",updateData)
customerNamesRouter.post("/deleteData",deleteData)
customerNamesRouter.get("/customerType",customer_type_Data)
customerNamesRouter.get("/webUserType",web_user_type)
customerNamesRouter.get("/limitType",limit_type)
customerNamesRouter.get("/customerDiscountType",customer_discount_type)
