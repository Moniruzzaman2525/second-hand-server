import { Router } from "express";
import { UserRoute } from "../modules/auth/auth.route";
import { AdminRoute } from "../modules/admin/admin.route";
import { ProductRoutes } from "../modules/products/products.route";


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
        path: '/product',
        route: ProductRoutes,
    },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
