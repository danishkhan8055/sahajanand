import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    category: {
      type: String,
    },
  },
  { timestamps: true }
);

export const BlogSchema = mongoose.model("Blog", blogSchema);