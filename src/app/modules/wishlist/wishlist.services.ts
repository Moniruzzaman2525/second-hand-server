import { JwtPayload } from "jsonwebtoken";
import { Wishlist } from "./wishlist.model";
import AppError from "../../error/AppError";
import { StatusCodes } from "http-status-codes";
import { Product } from "../products/products.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { TProduct } from "../products/products.interface";


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

const getUserWishlist = async (query: Record<string, unknown>, authUser: JwtPayload) => {
    const { ...pQuery } = query;
    const userQuery = new QueryBuilder(Wishlist.find({ userId: authUser.userId }).populate("product")
        , pQuery)
        .search(['product'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const products = await userQuery.modelQuery.lean();
    const meta = await userQuery.countTotal();
    const updatedProducts = products.map((item) => {
        const { product, ...rest } = item as { product?: TProduct } & Record<string, unknown>;
        return {
            ...rest,
            ...(product || {}), 
            wishlist: true,
        };
    });

    return {
        meta,
        result: updatedProducts,
    };
};

export const wishlistServices = {
    addWishlist, getUserWishlist
}
