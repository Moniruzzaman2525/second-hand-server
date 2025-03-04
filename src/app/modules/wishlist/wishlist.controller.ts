import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { IJwtPayload } from "../auth/auth.interface";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";


const addWishlist = catchAsync(async (req: Request, res: Response) => {
    const { sellerID, itemID } = req.body;
    const authUser = req.user as IJwtPayload;
    const result = await wishlistServices.addWishlist({ authUser, sellerID, itemID });

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Message sent successfully",
        data: result,
    });
});

export const wishlistController = {
    addWishlist
}
