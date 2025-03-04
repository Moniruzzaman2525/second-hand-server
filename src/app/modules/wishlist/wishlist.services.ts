import { JwtPayload } from "jsonwebtoken";
import { Wishlist } from "./wishlist.model";
import AppError from "../../error/AppError";
import { StatusCodes } from "http-status-codes";
import { Product } from "../products/products.model";


const addWishlist = async ({ authUser, itemID }: { authUser: JwtPayload, itemID: string }) => {
    const product = await Product.findById(itemID);
    if (product) {
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


export const wishlistServices = {
    addWishlist
}
