import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { Actor } from "../actor";
import { withTransaction } from "../db/transaction";
import { chats } from "./chat.sql";

export type Chat = typeof chats.$inferSelect;

export namespace Chat {
  export const PatchInput = z.object({
    title: z.string().optional(),
  });

  export async function list() {
    return await withTransaction(async (tx) => {
      const { userId } = Actor.useUser();
      return await tx.select().from(chats).where(eq(chats.userId, userId));
    });
  }

  export async function get(chatId: string) {
    return await withTransaction(async (tx) => {
      const actor = Actor.use();
      const chat = await tx.query.chats.findFirst({
        where: and(
          eq(chats.id, chatId),
          actor.type === "user"
            ? eq(chats.userId, actor.userId)
            : eq(chats.public, true),
        ),
      });
      return chat;
    });
  }

  export async function create() {
    return await withTransaction(async (tx) => {
      const actor = Actor.useUser();
      const [chat] = await tx
        .insert(chats)
        .values({ userId: actor.userId })
        .returning();
      return chat;
    });
  }

  export async function patch(
    chatId: string,
    input: z.infer<typeof PatchInput>,
  ) {
    return await withTransaction(async (tx) => {
      const actor = Actor.useUser();
      await tx
        .update(chats)
        .set(input)
        .where(and(eq(chats.id, chatId), eq(chats.userId, actor.userId)));
    });
  }

  export async function del(id: string) {
    return await withTransaction(async (tx) => {
      const actor = Actor.useUser();
      await tx
        .delete(chats)
        .where(and(eq(chats.id, id), eq(chats.userId, actor.userId)));
    });
  }
}
