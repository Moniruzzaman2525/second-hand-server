import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError";
import { StatusCodes } from "http-status-codes";
import { Product } from "../products/products.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { TProduct } from "../products/products.interface";
import { Compare } from "./compare.model";


const addCompare = async ({ authUser, item }: { authUser: JwtPayload, item: string }) => {
    const product = await Product.findById(item);
    if (!product) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'This product not available');
    }

    const data = {
        userId: authUser.userId,
        product: item
    };
    const transaction = new Compare(data);
    const result = await transaction.save();
    return result;
};

const getUserCompare = async (query: Record<string, unknown>, authUser: JwtPayload) => {
    const { ...pQuery } = query;


    const userQuery = new QueryBuilder(Compare.find({ userId: authUser.userId }).populate("product").populate('userId')
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
            userId: {
                _id: authUser.userId,
                email: authUser.email,
                name: authUser.name,
                role: authUser.role,
            },
        };
    });


    return {
        meta,
        result: updatedProducts,
    };
};


const removeCompare = async ({ authUser, compareId }: { authUser: JwtPayload, compareId: string }) => {

    const wishlistItem = await Compare.findOne({ userId: authUser.userId, product: compareId });
    if (!wishlistItem) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Item not found in compare');
    }
    const result = await Compare.deleteOne({ _id: wishlistItem._id });

    return result
};



export const compareServices = {
    addCompare, getUserCompare, removeCompare
}
