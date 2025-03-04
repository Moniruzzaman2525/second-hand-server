import { Types } from "mongoose";

export interface TWishlist {
    _id?: Types.ObjectId;
    productId: Types.ObjectId
    userId: Types.ObjectId
}
