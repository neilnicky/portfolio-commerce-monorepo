import { Hono } from "hono";
import type { AppContext } from "@presentation/middleware/context-injector";
import productsRoute from "./products.route";
import ordersRoute from "./orders.route";
import downloadRoute from "./download.route";
import webhooksRoute from "./webhooks.route";
import adminRoutes from "./admin/index";

const v1Routes = new Hono<AppContext>();

v1Routes.route("/products", productsRoute);
v1Routes.route("/orders", ordersRoute);
v1Routes.route("/download", downloadRoute);
v1Routes.route("/webhooks", webhooksRoute);
v1Routes.route("/admin", adminRoutes);

export default v1Routes;
