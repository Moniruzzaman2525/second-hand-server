import { Router } from "express";
import { UserRoute } from "../modules/auth/auth.route";
import { AdminRoute } from "../modules/admin/admin.route";
import { ProductRoutes } from "../modules/products/products.route";
import { userRoutes } from "../modules/user/user.route";
import { MessageRoute } from "../modules/message/message.route";


const router = Router()

const moduleRoutes = [
    {
        path: '/auth',
        route: UserRoute
    },
    {
        path: '/admin',
        route: AdminRoute
    },
    {
        path: '/listings',
        route: ProductRoutes,
    },
    {
        path: '/users',
        route: userRoutes,
    },
    {
        path: '/message',
        route: MessageRoute,
    },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
