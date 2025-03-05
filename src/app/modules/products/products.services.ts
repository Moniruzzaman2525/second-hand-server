import { StatusCodes } from 'http-status-codes';
import { TProduct } from './products.interface';
import { IImageFiles } from '../../interface/IImageFile';
import { IJwtPayload } from '../auth/auth.interface';
import AppError from '../../error/AppError';
import { Product } from './products.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { AuthUser } from '../auth/auth.model';
import { Types } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { Wishlist } from '../wishlist/wishlist.model';

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
    productData.userId = authUser.userId
    const newProduct = new Product(productData);
    const result = await newProduct.save();
    return result;
};



const getAllProduct = async (query: Record<string, unknown>, authUser: JwtPayload) => {
    const {
        minPrice,
        maxPrice,
        categories,
        ...pQuery
    } = query;

    const productQuery = new QueryBuilder(
        Product.find({
            permission: { $nin: ['pending', 'reject'] },
            // status: {$ne: 'sold'}
        })
            .populate('userId', 'name phoneNumber'),
        pQuery
    )
        .search(['title', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields()
        .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);
        const products = await productQuery.modelQuery.lean();
        if (authUser) {
            const wishlist = await Wishlist.find({ userId: authUser.userId }).lean();
            const wishlistProductIds = new Set(wishlist.map((item) => item.product.toString()));
            products.forEach((product: any) => {
                product.wishlist = wishlistProductIds.has(product._id.toString());
            });
        }
    const meta = await productQuery.countTotal();

    return {
        meta,
        result: products,
    };
};



const getAllProductByAdmin = async (query: Record<string, unknown>) => {
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
        Product.find({ userID })
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

const getSingleProduct = async (productId: string) => {
    const product = await Product.findById(productId).populate('userID', 'name phoneNumber email _id')

    if (!product) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
    }
    return {
        product
    };
};

const updateProduct = async (
    productId: string,
    payload: Partial<TProduct>,
    productImages: IImageFiles,
    authUser: IJwtPayload
) => {
    const { images } = productImages;


    const user = await AuthUser.findById(authUser.userId);

    if (user?.ban) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'User is not active');
    }
    const product = await Product.findById(productId);

    if (!product) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Product Not Found');
    }

    if (images && images.length > 0) {
        payload.images = images.map((image) => image.path);
    }

    return await Product.findByIdAndUpdate(productId, payload, { new: true });
};


const deleteProduct = async (productId: string) => {

    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Product Not Found');
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete product');
    }
    return deletedProduct;
};

const permissionProduct = async (productId: string, payload: { permission: string }) => {

    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Product not found!');
    }
    const completePermission = await Product.findByIdAndUpdate(
        productId,
        { permission: payload.permission },
        { new: true }
    );
    return completePermission;
};



export const ProductService = {
    createProduct, getAllProduct, getAllUserProduct, getSingleProduct, updateProduct, deleteProduct, getAllProductByAdmin, permissionProduct
}
