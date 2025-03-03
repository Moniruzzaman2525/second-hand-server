import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { IJwtPayload } from "../auth/auth.interface";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";



const getAllMessage = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductService.createProduct(
        req.user as IJwtPayload
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Message get successfully",
        data: result,
    });
});

export const messageController = {
    getAllMessage
}
