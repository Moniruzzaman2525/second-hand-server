import { Router } from 'express';
import auth from '../../middleware/auth';
import { UserRole } from '../auth/auth.interface';
import { transactionsServices } from './transactions.controller';

const router = Router();


router.get('/', auth(UserRole.USER || UserRole.ADMIN), transactionsServices.createNewTransaction);

export const transactionsRoute = router;
