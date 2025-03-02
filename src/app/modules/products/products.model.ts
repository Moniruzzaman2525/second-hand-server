import { model, Schema } from "mongoose";
import { TProduct } from "./products.interface";

const productSchema = new Schema<TProduct>({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    condition: {
        type: String,
        enum: ['new', 'used'],
        required: [true, 'Condition is required']
    },
    images: {
        type: [String],
        required: [true, 'At least one image is required']
    },
    userID: {
        type: String,
        ref: 'User',
        required: [true, 'Seller ID is required']
    },
    status: {
        type: String,
        enum: ['available', 'sold'],
        default: 'available'
    },
    category: {
        type: String,
        enum: [
            'electronics',
            'fashion',
            'for kids',
            'gadget accessories',
            'health & beauty',
            'hobbies sports',
            'home appliance',
            'laptop pc',
            'mobile',
            'video game consoles',
            'others',
            'vehicles',
            'services'
        ],
        required: [true, 'Category is required']
    }
}, {
    timestamps: true,
});

export const Product = model<TProduct>("Product", productSchema);
