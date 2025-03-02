import express from 'express'
import { userValidation } from './auth.validation'
import validateRequest from '../../middleware/validateRequest'
import { userControllers } from './auth.controller'
import auth from '../../middleware/auth'
import { UserRole } from './auth.interface'

const router = express.Router()

// auth user routes
router.post('/register', validateRequest(userValidation.userValidationSchema), userControllers.createUserController)
router.post('/login', validateRequest(userValidation.userValidationLoginSchema), userControllers.loginUserController)
router.post('/refresh-token', validateRequest(userValidation.refreshTokenValidationSchema), userControllers.refreshToken)
router.get('/get-me', auth(UserRole.USER, UserRole.ADMIN), userControllers.getMe);
router.post('/changes-password', auth(UserRole.USER, UserRole.ADMIN), validateRequest(userValidation.changesPasswordSchema), userControllers.changesPassword)
router.patch('/update-profile', auth(UserRole.USER, UserRole.ADMIN), userControllers.updateProfile);


export const UserRoute = router
