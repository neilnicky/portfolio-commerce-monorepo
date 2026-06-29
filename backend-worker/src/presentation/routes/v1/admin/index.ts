import { Hono } from "hono";
import type { AppContext } from "@presentation/middleware/context-injector";
import adminProductsRoute from "./products.route";
import adminOrdersRoute from "./orders.route";

const adminRoutes = new Hono<AppContext>();

adminRoutes.route("/products", adminProductsRoute);
adminRoutes.route("/orders", adminOrdersRoute);

export default adminRoutes;
