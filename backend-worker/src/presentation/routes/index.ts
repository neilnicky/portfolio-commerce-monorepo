import { Hono } from "hono";
import type { AppContext } from "@presentation/middleware/context-injector";
import v1Routes from "./v1/index";

const routes = new Hono<AppContext>();

routes.route("/v1", v1Routes);

export default routes;
