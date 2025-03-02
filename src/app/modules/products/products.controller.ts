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
    console.log(req.query)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Products are retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

export const ProductController = {
    createProduct, getAllProduct
};
