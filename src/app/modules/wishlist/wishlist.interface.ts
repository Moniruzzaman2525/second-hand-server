import { Types } from "mongoose";

export interface TWishlist {
    _id?: Types.ObjectId;
    product: Types.ObjectId
    userId: Types.ObjectId
}
