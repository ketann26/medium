import { createBlogInput, updateBlogInput } from "@ketan-26/medium-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string;
		JWT_SECRET: string;
	};
	Variables: {
		userId: string;
	};
}>();

blogRouter.use(async (c, next) => {
	const authHeader = c.req.header("Authorization") || "";
	const token = authHeader.split(" ")[1];

	const user = await verify(token, c.env.JWT_SECRET);

	if (user) {
		c.set("userId", user.id);
		await next();
	} else {
		c.status(403);
		c.json({ message: "You are not logged in" });
	}
});

blogRouter.post("", async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const { success } = createBlogInput.safeParse(body);

	if (!success) {
		c.status(411);
		return c.json({ message: "Incorrect inputs" });
	}

	try {
		const newPost = await prisma.post.create({
			data: {
				title: body.title,
				content: body.content,
				authorId: c.get("userId"),
			},
		});

		return c.json({ id: newPost.id, message: "New post created" });
	} catch (e) {
		c.status(500);
		return c.json({ error: "An error occurred" });
	}
});

blogRouter.put("/:id", async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const { success } = updateBlogInput.safeParse(body);

	if (!success) {
		c.status(411);
		return c.json({ message: "Incorrect inputs" });
	}

	try {
		const updatedPost = await prisma.post.update({
			where: {
				id: c.req.query("id"),
			},
			data: {
				title: body.title,
				content: body.content,
			},
		});

		return c.json({ id: updatedPost.id, message: "Post updated" });
	} catch (e) {
		c.status(500);
		return c.json({ error: "An error occurred" });
	}
});

blogRouter.get("/bulk", async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate());

	try {
		const allPosts = await prisma.post.findMany();

		return c.json(allPosts);
	} catch (e) {
		c.status(404);
		return c.json({ error: "No such post exists!" });
	}
});

blogRouter.get("/:id", async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate());

	try {
		const optionalPost = await prisma.post.findUnique({
			where: {
				id: c.req.query("id"),
			},
		});

		return c.json({ post: optionalPost });
	} catch (e) {
		c.status(404);
		return c.json({ error: "No such post exists!" });
	}
});
