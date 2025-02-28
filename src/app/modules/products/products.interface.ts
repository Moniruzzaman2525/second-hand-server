import { Types } from "mongoose";

export interface TProduct {
    _id?: Types.ObjectId;
    title: string;
    description: string;
    price: number;
    condition: 'new' | 'used';
    images: string[];
    userID: Types.ObjectId;
    status?: 'available' | 'sold';
}
