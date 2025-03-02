import { StatusCodes } from 'http-status-codes';
import { TProduct } from './products.interface';
import { IImageFiles } from '../../interface/IImageFile';
import { IJwtPayload } from '../auth/auth.interface';
import AppError from '../../error/AppError';
import { Product } from './products.model';
import QueryBuilder from '../../builder/QueryBuilder';

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
    productData.userID = authUser.userId
    const newProduct = new Product(productData);
    const result = await newProduct.save();
    return result;
};

const getAllProduct = async (query: Record<string, unknown>) => {
    const {
        minPrice,
        maxPrice,
        categories,
        ...pQuery
    } = query;


    const productQuery = new QueryBuilder(
        Product.find()
            .populate('userID', 'name phoneNumber'),
        pQuery
    )
        .search(['title', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields()
        .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);

    const products = await productQuery.modelQuery.lean();

    const meta = await productQuery.countTotal();


    return {
        meta,
        result: products,
    };
};

const getAllUserProduct = async (query: Record<string, unknown>, userID: string) => {
    const {
        minPrice,
        maxPrice,
        categories,
        ...pQuery
    } = query;

    const productQuery = new QueryBuilder(
        Product.find({ userID })  // Filter by userID
            .populate('userID', 'name phoneNumber'),
        pQuery
    )
        .search(['title', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields()
        .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);

    const products = await productQuery.modelQuery.lean();

    const meta = await productQuery.countTotal();

    return {
        meta,
        result: products,
    };
};

export const ProductService = {
    createProduct, getAllProduct, getAllUserProduct
}
