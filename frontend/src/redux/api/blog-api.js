import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const blogApi = createApi({
  reducerPath: "blogApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/blog",
    credentials: "include",
  }),

  tagTypes: ["Blogs"],

  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: ({ page = 1, limit = 5, search = "", category = "" } = {}) =>
        `/get?page=${page}&limit=${limit}&search=${search}&category=${category}`,
      providesTags: ["Blogs"],
    }),

    getBlogById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ["Blogs"],
    }),

    createBlog: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("category", data.category);
        if (data.image) {
          formData.append("image", data.image);
        }

        return {
          url: "/create",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Blogs"],
    }),

    updateBlog: builder.mutation({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("category", data.category);
        if (data.image) {
          formData.append("image", data.image);
        }

        return {
          url: `/update/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Blogs"],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blogs"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
