import { JwtPayload } from "jsonwebtoken";
import { Wishlist } from "./wishlist.model";
import AppError from "../../error/AppError";
import { StatusCodes } from "http-status-codes";
import { Product } from "../products/products.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { IJwtPayload } from "../auth/auth.interface";


const addWishlist = async ({ authUser, itemID }: { authUser: JwtPayload, itemID: string }) => {
    const product = await Product.findById(itemID);
    if (!product) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'This product not available');
    }

    const data = {
        userId: authUser.userId,
        productId: itemID
    };
    const transaction = new Wishlist(data);
    const result = await transaction.save();
    return result;
};

const getUserWishlist = async (query: Record<string, unknown>, authUser: IJwtPayload) => {
    const {
        minPrice,
        maxPrice,
        categories,
        ...pQuery
    } = query;

    const productQuery = new QueryBuilder(
        Product.find({ authUser })
            .populate('productId'),
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
    const updatedProducts = products.map(product => ({
        ...product,
        wishlist: true,
    }));

    return {
        meta,
        result: updatedProducts,
    };
};

export const wishlistServices = {
    addWishlist, getUserWishlist
}
