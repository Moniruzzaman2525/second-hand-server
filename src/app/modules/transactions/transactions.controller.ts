import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IJwtPayload } from "../auth/auth.interface";
import { Request, Response } from "express";


const createNewTransaction = catchAsync(async (req: Request, res: Response) => {
    const { sellerID, itemID } = req.body;
    const authUser = req.user as IJwtPayload;
    const result = await transactionServices.createNewTransaction(authUser, sellerID, itemID);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Message sent successfully",
        data: result,
    });
});

export const transactionsServices = {
    createNewTransaction
}
