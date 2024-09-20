import { zValidator } from "@hono/zod-validator";
import { Actor } from "@project-4/core/actor";
import { Chat } from "@project-4/core/chat/index";
import { Message } from "@project-4/core/messages/index";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { authorize } from "../authorize";

const app = new Hono()
  .use(async (c, next) => {
    const userId = await authorize(
      c.req.header("authorization")?.split(" ")[1] ?? ""
    );
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    return await Actor.with(userId, next);
  })
  .get("/chats", async (c) => {
    return c.json(await Chat.list());
  })
  .post("/chats", async (c) => {
    return c.json(await Chat.create());
  })
  .patch("/chats/:chatId", zValidator("json", Chat.PatchInput), async (c) => {
    await Chat.patch(c.req.param("chatId"), c.req.valid("json"));
    return c.json({ success: true });
  })
  .delete("/chats/:chatId", async (c) => {
    await Chat.del(c.req.param("chatId"));
    return c.json({ success: true });
  })
  .get("/chats/:chatId", async (c) => {
    const chat = await Chat.get(c.req.param("chatId"));
    if (!chat) {
      return c.json({ error: "Chat not found" }, 404);
    }
    return c.json(chat);
  })
  .get("/chats/:chatId/messages", async (c) => {
    const messages = await Message.list(c.req.param("chatId"));
    return c.json(messages);
  })
  .post(
    "/chats/:chatId/messages",
    zValidator("json", Message.Insert),
    async (c) => {
      return c.json(await Message.create(c.req.valid("json")));
    }
  );

export const handler = handle(app);
