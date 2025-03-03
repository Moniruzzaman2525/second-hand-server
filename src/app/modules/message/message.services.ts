import { IJwtPayload } from "../auth/auth.interface";
import { IUser, TMessagePopulated } from "./message.interface";
import { Message } from "./message.model";


const sendMessage = async (authUser: IJwtPayload, receiverID: string, message: string) => {
    const newMessage = new Message({
        senderID: authUser.userId,
        receiverID,
        message,
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
    })
        
        .populate('senderID', 'name')  
        .populate('receiverID', 'name');  

    
    const users = result.map((message: TMessagePopulated) => {
        let otherUser: IUser;

        
        if (message.senderID && (message.senderID as IUser)._id.toString() !== authUser.userId.toString()) {
            
            otherUser = message.senderID as IUser;
        } else {
            
            otherUser = message.receiverID as IUser;
        }

        
        return {
            id: otherUser._id,
            name: otherUser.name,
            lastMessage: message.message,  
        };
    });

    return users;
};




export const messageServices = {
    sendMessage,
    getAllMessage,
};
