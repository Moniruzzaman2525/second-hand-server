import { IJwtPayload } from "../auth/auth.interface";
import { Message } from "./message.model";


const getAllMessage = async (authUser: IJwtPayload) => {
    const result = Message.find({ senderID: authUser.userId})
    return result;
};

export const messageServices = {
    getAllMessage
}
