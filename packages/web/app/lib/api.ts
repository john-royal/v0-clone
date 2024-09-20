import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { Chat, Message } from "@project-4/core/types";

import { State } from "./store";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, api) => {
      const token = (api.getState() as State).state?.token;
      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Chat", "Message"],
  endpoints: (builder) => ({
    listChats: builder.query<Chat[], void>({
      query: () => "/chats",
      providesTags: ["Chat"],
    }),
    createChat: builder.mutation<Chat, void>({
      query: () => ({
        url: "/chats",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }),
      invalidatesTags: ["Chat"],
    }),
    getChat: builder.query<Chat, string>({
      query: (chatId) => `/chats/${chatId}`,
      providesTags: ["Chat"],
    }),
    deleteChat: builder.mutation<void, string>({
      query: (chatId) => ({
        url: `/chats/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),
    listMessages: builder.query<Message[], string>({
      query: (chatId) => `/chats/${chatId}/messages`,
      providesTags: ["Message"],
    }),
    createMessage: builder.mutation<void, Message.Insert>({
      query: (message) => ({
        url: `/chats/${message.chatId}/messages`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      }),
      invalidatesTags: ["Message"],
    }),
  }),
});

export const {
  useListChatsQuery,
  useListMessagesQuery,
  useGetChatQuery,
  useCreateMessageMutation,
  useCreateChatMutation,
  useDeleteChatMutation,
} = api;
