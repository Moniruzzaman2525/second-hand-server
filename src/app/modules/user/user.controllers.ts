import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";


const getAllUser = catchAsync(async (req, res) => {
    const result = await userServices.getAllProduct(req.query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Products are retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

export const userController = {
    getAllUser
}
