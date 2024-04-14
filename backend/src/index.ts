import { Hono } from "hono";
import { cors } from "hono/cors";

import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string;
		JWT_SECRET: string;
	};
	// Variables: {
	// 	prisma: PrismaClient;
	// };
}>();

// app.use(async (c, next) => {
// 	const prisma = new PrismaClient({
// 		datasourceUrl: c.env.DATABASE_URL,
// 	}).$extends(withAccelerate());

// 	c.set("prisma", prisma);

// 	await next();
// });

app.use("/*", cors());
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;
