import { JwtPayload } from "jsonwebtoken";
import { Transaction } from "./transactions.model";
import AppError from "../../error/AppError";



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

const getUserBuyerTransactions = async (userId: JwtPayload) => {
    try {
        const transactions = await Transaction.find({
            $or: [
                { buyerID: userId },
            ]
        }).populate('sellerID');
        return transactions;
    } catch (error) {

        throw new AppError(500, 'An error occurred while fetching transactions.');
    }
};
const getUserSellerIdTransactions = async (userId: JwtPayload) => {
    try {
        const transactions = await Transaction.find({
            $or: [
                { sellerID: userId },
            ]
        }).populate('buyerID');
        return transactions;
    } catch (error) {

        throw new AppError(500, 'An error occurred while fetching transactions.');
    }
};


export const transactionServices = {
    createNewTransaction,
    getUserSellerIdTransactions,
    getUserBuyerTransactions
}
