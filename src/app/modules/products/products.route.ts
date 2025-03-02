import { Router } from 'express';
import auth from '../../middleware/auth';
import { ProductController } from './products.controller';
import { UserRole } from '../auth/auth.interface';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middleware/bodyParser';
import validateRequest from '../../middleware/validateRequest';
import { productValidation } from './products.validation';

const router = Router();

router.post(
    '/',
    auth(UserRole.USER),
    multerUpload.fields([{ name: 'images' }]),
    parseBody,
    validateRequest(productValidation.createProductValidationSchema),
    ProductController.createProduct
);

router.get('/', ProductController.getAllProduct);

export const ProductRoutes = router;
