import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.services";


const getAllUser = catchAsync(async (req, res) => {
    const result = await userServices.getAllUser(req.query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Users are retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

export const userController = {
    getAllUser
}
