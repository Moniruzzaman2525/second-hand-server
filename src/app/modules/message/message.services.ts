import { IJwtPayload } from "../auth/auth.interface";
import { Message } from "./message.model";


const sendMessage = async (authUser: IJwtPayload, receiverID: string, content: string) => {
    const newMessage = new Message({
        senderID: authUser.userId,
        receiverID,
        content, 
        timestamp: new Date(), 
    });

    const savedMessage = await newMessage.save(); 
    return savedMessage;
};


const getAllMessage = async (authUser: IJwtPayload) => {
    const result = await Message.find({
        $or: [
            { senderID: authUser.userId },
            { receiverID: authUser.userId }
        ]
    });
    return result;
};

export const messageServices = {
    sendMessage,
    getAllMessage,
};
