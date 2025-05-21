import { Router } from 'express';
import auth from '../../middleware/auth';
import { UserRole } from '../auth/auth.interface';
import { compareController } from './compare.controller';

const router = Router();


router.post('/', auth(UserRole.USER, UserRole.ADMIN), compareController.addCompare);
router.get('/', auth(UserRole.USER, UserRole.ADMIN), compareController.getUserCompare);
router.delete('/:compareId', auth(UserRole.USER, UserRole.ADMIN), compareController.removeCompare);


export const wishlistRoute = router;
