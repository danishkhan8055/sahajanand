import { UserSchema } from "../model/user-model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "Name, email and password required",
      });
    }

    const emailExist = await UserSchema.findOne({ email });

    if (emailExist) {
      return res.status(400).json({
        status: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserSchema.create({
      name,
      email,
      password: hashedPassword,
      role: "user", // explicitly set
    });

    return res.status(201).json({
      status: true,
      message: "User Registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password required",
      });
    }

    const userExist = await UserSchema.findOne({ email });

    if (!userExist) {
      return res.status(400).json({
        status: false,
        message: "Invalid credentials",
      });
    }

    const comparePassword = await bcrypt.compare(password, userExist.password);

    if (!comparePassword) {
      return res.status(400).json({
        status: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: userExist._id,
        email: userExist.email,
        role: userExist.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: true,
      message: "Login successful",
      data: {
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        role: userExist.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", role } = req.query;

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    // Build dynamic query
    let query = { role: { $ne: "admin" } };

    // 🔍 Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    const users = await UserSchema.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const totalUsers = await UserSchema.countDocuments(query);

    return res.status(200).json({
      status: true,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { name, email, isActive } = req.body;

    const user = await UserSchema.findByIdAndUpdate(
      req.params.id,
      { name, email, isActive },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    return res.json({
      status: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await UserSchema.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.json({
      status: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};