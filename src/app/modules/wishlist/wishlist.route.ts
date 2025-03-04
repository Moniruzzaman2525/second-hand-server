import { Router } from 'express';
import auth from '../../middleware/auth';
import { UserRole } from '../auth/auth.interface';
import { wishlistController } from './wishlist.controller';

const router = Router();


router.post('/', auth(UserRole.USER || UserRole.ADMIN), wishlistController.addWishlist);

export const wishlistRoute = router;
