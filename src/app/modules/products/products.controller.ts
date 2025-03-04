import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ProductService } from "./products.services";
import { IImageFiles } from "../../interface/IImageFile";
import { IJwtPayload } from "../auth/auth.interface";

const createProduct = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductService.createProduct(
        req.body,
        req.files as IImageFiles,
        req.user as IJwtPayload
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Product created successfully",
        data: result,
    });
});
const getAllProduct = catchAsync(async (req, res) => {
    const result = await ProductService.getAllProduct(req.query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Products are retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});
const getAllProductByAdmin = catchAsync(async (req, res) => {
    const result = await ProductService.getAllProductByAdmin(req.query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Products are retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

const getAllUserProductHandler = catchAsync(async (req, res) => {
    const userID = req.user.userId;
    const result = await ProductService.getAllUserProduct(req.query, userID);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User's products retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});


const getSingleProduct = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const result = await ProductService.getSingleProduct(productId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Product retrieved successfully",
        data: result,
    });
});

const updateProduct = catchAsync(async (req, res) => {
    const {
        user,
        body: payload,
        params: { productId },
    } = req;

    const result = await ProductService.updateProduct(
        productId,
        payload,
        req.files as IImageFiles,
        user as IJwtPayload
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Product updated successfully",
        data: result,
    });
});

const deleteProduct = catchAsync(async (req, res) => {
    const {
        params: { productId },
    } = req;

    const result = await ProductService.deleteProduct(
        productId
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Product deleted successfully!",
        data: result,
    });
});


export const ProductController = {
    createProduct, getAllProduct, getAllUserProductHandler, getSingleProduct, updateProduct, deleteProduct, getAllProductByAdmin
};
