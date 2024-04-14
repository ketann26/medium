import { signinInput, signupInput } from "@ketan-26/medium-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string;
		JWT_SECRET: string;
	};
}>();

userRouter.post("/signup", async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const { success } = signupInput.safeParse(body);

	if (!success) {
		c.status(411);
		return c.json({ message: "Incorrect inputs" });
	}

	try {
		const user = await prisma.user.create({
			data: {
				name: body.name,
				email: body.email,
				password: body.password,
			},
		});

		const secret = c.env.JWT_SECRET;
		const token = await sign({ id: user.id }, secret);

		return c.json({ jwt: token, message: "User signed up!" });
	} catch (e) {
		c.status(411);
		return c.json({ error: "An error occurred" });
	}
});

userRouter.post("/signin", async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const { success } = signinInput.safeParse(body);

	if (!success) {
		c.status(411);
		return c.json({ message: "Incorrect inputs" });
	}

	const optionalUser = await prisma.user.findUnique({
		where: {
			email: body.email,
			password: body.password,
		},
	});

	if (!optionalUser) {
		c.status(403);
		return c.json({ error: "User not found" });
	}

	const token = await sign({ id: optionalUser.id }, c.env.JWT_SECRET);

	return c.json({ jwt: token, message: "User signed in!" });
});
