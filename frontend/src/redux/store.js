import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/user-api.js";
import { blogApi } from "./api/blog-api.js";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(blogApi.middleware),
});