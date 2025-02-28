import { Types } from "mongoose";

export interface TMessage {
    _id?: Types.ObjectId;
    senderID: Types.ObjectId;
    receiverID: Types.ObjectId;
    message: string;
    timestamp?: Date;
}
