import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { IJwtPayload } from "../auth/auth.interface";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { compareServices } from "./compare.services";


const addCompare = catchAsync(async (req: Request, res: Response) => {
    const { item } = req.body;
    const authUser = req.user as IJwtPayload;
    const result = await compareServices.addCompare({ authUser, item });

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Compare add successfully",
        data: result,
    });
});
const getUserCompare = catchAsync(async (req: Request, res: Response) => {
    const authUser = req.user as IJwtPayload;
    const result = await compareServices.getUserCompare(req.query, authUser);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Compare product are retrieved successfully",
        data: result,
    });
});

const removeCompare = catchAsync(async (req, res) => {
    const {
        params: { wishlistId: compareId },
    } = req;
    const authUser = req.user as IJwtPayload;

    const result = await compareServices.removeCompare({ authUser, wishlistId: compareId });
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Compare remove successfully!",
        data: result,
    });
});

export const compareController = {
    addCompare, getUserCompare, removeCompare
}
