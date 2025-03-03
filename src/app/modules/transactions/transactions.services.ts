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



export const transactionServices = {
    createNewTransaction
}
