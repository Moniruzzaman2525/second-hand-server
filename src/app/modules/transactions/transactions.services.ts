import { JwtPayload } from "jsonwebtoken";
import { Transaction } from "./transactions.model";
import AppError from "../../error/AppError";
import QueryBuilder from "../../builder/QueryBuilder";



const createNewTransaction = async ({ authUser, sellerID, itemID }: { authUser: JwtPayload, sellerID: string, itemID: string }) => {
    const existingTransaction = await Transaction.findOne({ buyerID: authUser.userId, sellerID, itemID });
    if (existingTransaction) {
        throw new AppError(400 ,'You have already purchased this item from this seller');
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
    const userQuery = new QueryBuilder(Transaction.find({ buyerID: userId.userId }).populate('sellerID', 'name phoneNumber').populate('itemID', 'title price').populate('buyerID', 'name phoneNumber')
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
    const userQuery = new QueryBuilder(Transaction.find({ sellerID: userId.userId }).populate('sellerID', 'name phoneNumber').populate('itemID', 'title price').populate('buyerID', 'name phoneNumber')
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



export const transactionServices = {
    createNewTransaction,
    getUserSellerIdTransactions,
    getUserBuyerTransactions
}
