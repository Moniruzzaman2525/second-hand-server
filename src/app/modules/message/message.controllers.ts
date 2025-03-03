import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { IJwtPayload } from "../auth/auth.interface";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { messageServices } from "./message.services";


const sendMessage = catchAsync(async (req: Request, res: Response) => {
    const { receiverID, content } = req.body; 
    const authUser = req.user as IJwtPayload;
    const result = await messageServices.sendMessage(authUser, receiverID, content);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Message sent successfully",
        data: result,
    });
});


const getAllMessage = catchAsync(async (req: Request, res: Response) => {
    const result = await messageServices.getAllMessage(req.user as IJwtPayload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Messages retrieved successfully",
        data: result,
    });
});

export const messageController = {
    sendMessage,
    getAllMessage,
};
