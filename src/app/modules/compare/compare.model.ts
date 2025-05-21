import { model, Schema, Types } from "mongoose";
import { TCompare } from "./compare.interface";


const compareSchema = new Schema<TCompare>({
    product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product",
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
}, {
    timestamps: true,
});

export const Compare = model<TCompare>("Compare", compareSchema);
