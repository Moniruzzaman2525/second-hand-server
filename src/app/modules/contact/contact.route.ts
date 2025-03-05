import { Router } from 'express';

const router = Router();


router.post('/', contactController.contactUs);

export const contactRoute = router;
