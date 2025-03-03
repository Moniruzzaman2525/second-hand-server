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
    const {
        minPrice,
        maxPrice,
        categories,
        ...pQuery
    } = query;


    const productQuery = new QueryBuilder(
        Transaction.find({ buyerID: userId })
            .populate('sellerID', 'name email phoneNumber'),
        pQuery
    )
        .search(['sellerID', 'description'])
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
const getUserSellerIdTransactions = async (query: Record<string, unknown>, userId: JwtPayload) => {
    const {
        minPrice,
        maxPrice,
        categories,
        ...pQuery
    } = query;


    const productQuery = new QueryBuilder(
        Transaction.find({ sellerID: userId })
            .populate('buyerID', 'name email phoneNumber'),
        pQuery
    )
        .search(['sellerID', 'description'])
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



export const transactionServices = {
    createNewTransaction,
    getUserSellerIdTransactions,
    getUserBuyerTransactions
}
