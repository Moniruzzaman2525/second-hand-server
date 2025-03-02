import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { UserRole } from '../auth/auth.interface';
import { userControllers } from '../auth/auth.controller';
import { userValidation } from '../auth/auth.validation';

const router = express.Router()

// user user routes
router.get('/get-me', auth(UserRole.USER, UserRole.ADMIN), userControllers.getMe);
router.post('/changes-password', auth(UserRole.USER, UserRole.ADMIN), validateRequest(userValidation.changesPasswordSchema), userControllers.changesPassword)
router.patch('/', auth(UserRole.USER, UserRole.ADMIN), userControllers.updateProfile);


export const userRoutes = router
