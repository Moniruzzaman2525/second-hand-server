import { JwtPayload } from "jsonwebtoken";
import { Transaction } from "./transactions.model";
import AppError from "../../error/AppError";
import QueryBuilder from "../../builder/QueryBuilder";
import { StatusCodes } from "http-status-codes";



const createNewTransaction = async ({ authUser, sellerID, itemID }: { authUser: JwtPayload, sellerID: string, itemID: string }) => {
    const existingTransaction = await Transaction.findOne({ buyerID: authUser.userId, sellerID, itemID });
    if (existingTransaction) {
        throw new AppError(StatusCodes.BAD_REQUEST ,'You have already purchased this item from this seller');
    }
    const data = {
        buyerID: authUser.userId,
        sellerID,
        itemID
    };
    const transaction = new Transaction(data);
    const result = await transaction.save();
    return result;
};

const getUserBuyerTransactions = async (query: Record<string, unknown>, userId: JwtPayload) => {
    const { ...pQuery } = query;
    const userQuery = new QueryBuilder(Transaction.find({ buyerID: userId.userId }).populate('sellerID', 'name phoneNumber').populate('itemID', 'title price category').populate('buyerID', 'name phoneNumber')
        , pQuery)
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

const getUserSellerIdTransactions = async (query: Record<string, unknown>, userId: JwtPayload) => {
    const { ...pQuery } = query;
    const userQuery = new QueryBuilder(Transaction.find({ sellerID: userId.userId }).populate('sellerID', 'name phoneNumber').populate('itemID', 'title price category').populate('buyerID', 'name phoneNumber')
        , pQuery)
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

const transactionComplete = async (id: string, userId: JwtPayload) => {
        const transaction = await Transaction.findById(id)
        if (!transaction?.sellerID !== !userId.userId) {
            throw new AppError(StatusCodes.FORBIDDEN, 'You are not authorized!')
        }

        const completeTransaction = await Transaction.findByIdAndUpdate(
            id,
            { status: 'completed' },
            { new: true }
        )
    return completeTransaction
}

const deleteTransactions = async (transactionId: string) => {

    const product = await Transaction.findById(transactionId);
    if (!product) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Product Not Found');
    }

    const deletedProduct = await Transaction.findByIdAndDelete(transactionId);
    if (!deletedProduct) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete product');
    }
    return deletedProduct;
};

export const transactionServices = {
    createNewTransaction,
    getUserSellerIdTransactions,
    getUserBuyerTransactions,
    transactionComplete,
    deleteTransactions
}
