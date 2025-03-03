import { Router } from 'express';
import auth from '../../middleware/auth';
import { UserRole } from '../auth/auth.interface';

const router = Router();


router.get('/', auth(UserRole.USER || UserRole.ADMIN), );

export const transactionsRoute = router;
