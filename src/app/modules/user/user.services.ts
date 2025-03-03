import QueryBuilder from "../../builder/QueryBuilder";
import { AuthUser } from "../auth/auth.model";

const getAllUser = async (query: Record<string, unknown>) => {
    const {...pQuery } = query;

    const userQuery = new QueryBuilder(AuthUser.find(), pQuery)
        .search(['name', 'email'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const users = await userQuery.modelQuery.lean();
    const meta = await userQuery.countTotal();

    return {
        meta,
        result: users,
    };
};



export const userServices = {
    getAllUser
}
