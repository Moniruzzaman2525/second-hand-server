import QueryBuilder from "../../builder/QueryBuilder";
import { AuthUser } from "../auth/auth.model";

const getAllUser = async (query: Record<string, unknown>) => {
    const {
        minPrice,
        maxPrice,
        categories,
        ...pQuery
    } = query;


    const productQuery = new QueryBuilder(
        AuthUser.find(),
        pQuery
    )
        .search(['name', 'location'])
        .filter()
        .sort()
        .paginate()
        .fields()
        .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);

    const users = await productQuery.modelQuery.lean();

    const meta = await productQuery.countTotal();


    return {
        meta,
        result: users,
    };
};


export const userServices = {
    getAllUser
}
