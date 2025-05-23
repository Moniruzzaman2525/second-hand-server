import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { AuthUser } from "../auth/auth.model";
import { Product } from "../products/products.model";

const getAllUser = async (query: Record<string, unknown>) => {
    const { ...pQuery } = query;

    const userQuery = new QueryBuilder(AuthUser.find(), pQuery)
        .search(['name', 'email'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const users = await userQuery.modelQuery.lean();
    const meta = await userQuery.countTotal();

    return {
        meta,
        result: users,
    };
};
const deleteUser = async (userId: string) => {

    const user = await AuthUser.findById(userId);
    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User Not Found');
    }

    const deletedUser = await AuthUser.findByIdAndDelete(userId);
    if (!deletedUser) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete product');
    }
    return deletedUser;
};

const getUserById = async (userId: string) => {
    const user = await AuthUser.findById(userId).lean();

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User Not Found');
    }

    const products = await Product.find({
        userId: user._id,
        permission: { $nin: ['pending', 'reject'] }
    })
        .populate('userId', 'name phoneNumber')
        .lean();

    return {
        user: {
            _id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber
        },
        products
    };
};


export const userServices = {
    getAllUser, deleteUser, getUserById
}
