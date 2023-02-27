import { Hono } from "hono";
import users from "./users/users"
import pets from "./pets/pets";
export type Env = {
	CHILEADOPTA: D1Database;
}

const app = new Hono<{ Bindings:Env }>();
app.route('/pets', pets)
app.route('/users', users)

export default app;