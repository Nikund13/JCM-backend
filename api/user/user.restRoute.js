import express from 'express'
import {
    getProfile,
    licenseStation
} from './user.controller'
export const userRouter = express.Router();

userRouter.get("/getProfile",getProfile)
userRouter.get("/licenseStation",licenseStation)
