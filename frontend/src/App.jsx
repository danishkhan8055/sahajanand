import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./component/user/register";
import Login from "./component/user/login";
import Home from "./component/blog/home";
import CreateBlog from "./component/blog/create-blog";
import BlogDetail from "./component/blog/blog-detail";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-blog" element={<CreateBlog />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
    </Routes>
  );
};

export default App;