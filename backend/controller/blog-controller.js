import { BlogSchema } from "../model/blog-model.js";

export const createBlog = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    console.log("hello");
    

    const blog = await BlogSchema.create({
      title,
      description,
      category,
      image: req.file ? req.file.filename : null,
      author: req.user.id,
    });

    res.status(201).json({
      status: true,
      message: "Blog created",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
};
export const getBlogs = async (req, res) => {
  try {
    let { page = 1, limit = 5, search = "", category } = req.query;

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const blogs = await BlogSchema.find(query)
      .populate("author", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await BlogSchema.countDocuments(query);

    res.json({
      status: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: blogs,
    });
  } catch (error) {
    console.error(error);
    
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
};
export const updateBlog = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const blog = await BlogSchema.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        image: req.file ? req.file.filename : undefined,
      },
      { new: true }
    );

    res.json({
      status: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
};
export const deleteBlog = async (req, res) => {
  try {
    await BlogSchema.findByIdAndDelete(req.params.id);

    res.json({
      status: true,
      message: "Blog deleted",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
};