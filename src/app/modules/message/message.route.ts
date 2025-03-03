import { Router } from 'express';
import auth from '../../middleware/auth';
import { messageController } from './message.controllers';
import { UserRole } from '../auth/auth.interface';

const router = Router();


router.get('/', auth(UserRole.USER || UserRole.ADMIN), messageController.getAllMessage);
router.post('/', auth(UserRole.USER || UserRole.ADMIN), messageController.sendMessage);

export const MessageRoute = router;
