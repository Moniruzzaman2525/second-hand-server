import { Transaction } from "./transactions.model";



const createNewTransaction = async () => {

    const transactions = new Transaction();
    const result = await transactions.save();
    return result;
};


export const transactionServices = {
    createNewTransaction
}
