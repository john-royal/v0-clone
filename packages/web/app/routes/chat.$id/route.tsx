import { type LoaderFunctionArgs } from "@remix-run/node";
import { ErrorResponse, useRouteError } from "@remix-run/react";
import { useState } from "react";
import { useSendMessage } from "~/api/hooks";
import { api } from "~/api/server";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { withHydrationBoundary } from "~/lib/with-hydration-boundary";
import { useChatConnection, useCurrentChat } from "./hooks";
import { Editor } from "./editor";

export const loader = async (args: LoaderFunctionArgs) => {
  return await api(args).prefetch((api) =>
    api.query("/chats/:id", { params: { id: args.params.id! } }),
  );
};

export default withHydrationBoundary(function Chat() {
  const chat = useCurrentChat();

  useChatConnection();

  return (
    <main className="grid h-screen grid-cols-2 bg-muted/25">
      <div className="flex flex-col">
        <h1>{chat.title ?? "Untitled"}</h1>
        <div className="flex flex-1 flex-col justify-end">
          {chat.messages.map((message) => (
            <div key={message.id}>{message.content}</div>
          ))}
          <MessageInput id={chat.id} />
        </div>
      </div>
      <div className="flex flex-col">
        <Editor />
      </div>
    </main>
  );
});

function MessageInput({ id }: { id: string }) {
  const [message, setMessage] = useState("");
  const sendMessage = useSendMessage();

  return (
    <form
      className="flex flex-row gap-2 p-2"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage.mutate({ id, content: message });
        setMessage("");
      }}
    >
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button type="submit" disabled={sendMessage.isPending}>
        Send
      </Button>
    </form>
  );
}

export function ErrorBoundary() {
  const error = useRouteError() as Error | ErrorResponse;

  return (
    <div>
      Error: {"statusText" in error ? error.statusText : error.message}{" "}
    </div>
  );
}
