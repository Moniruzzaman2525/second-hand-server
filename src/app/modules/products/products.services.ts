import { StatusCodes } from 'http-status-codes';
import { TProduct } from './products.interface';
import { IImageFiles } from '../../interface/IImageFile';
import { IJwtPayload } from '../auth/auth.interface';
import AppError from '../../error/AppError';

const createProduct = async (
    productData: Partial<TProduct>,
    productImages: IImageFiles,
    authUser: IJwtPayload
) => {

    const { images } = productImages;
    if (!images || images.length === 0) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            'Product images are required.'
        );
    }

    productData.images = images.map((image) => image.path);

    console.log(productData)
};




export const ProductService = {
    createProduct
}
