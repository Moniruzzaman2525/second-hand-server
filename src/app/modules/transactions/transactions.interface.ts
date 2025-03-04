import { Types } from "mongoose";

export interface TTransaction {
    _id?: Types.ObjectId;
    buyerID: Types.ObjectId;
    sellerID: Types.ObjectId;
    itemID: Types.ObjectId;
    status?: 'pending' | 'completed'
}
