import { Router } from 'express';
import auth from '../../middleware/auth';
import { UserRole } from '../auth/auth.interface';
import { transactionsServices } from './transactions.controller';

const router = Router();


router.post('/', auth(UserRole.USER || UserRole.ADMIN), transactionsServices.createNewTransaction);
router.get('/', auth(UserRole.USER || UserRole.ADMIN), transactionsServices.getUserBuyerTransactions);
router.get('/seller', auth(UserRole.USER || UserRole.ADMIN), transactionsServices.getUserSellerTransactions);
router.post('/complete-sales', auth(UserRole.USER || UserRole.ADMIN), transactionsServices.getConfirmTransactions);

export const transactionsRoute = router;
