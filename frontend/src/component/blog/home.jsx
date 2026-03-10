import { useNavigate } from "react-router-dom";
import { useGetBlogsQuery } from "../../redux/api/blog-api";
import { useState } from "react";
import UserManagement from "../admin/user-management";
import BlogManagement from "../admin/blog-management";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [adminTab, setAdminTab] = useState("users");
  const [debounceSearch , setDebounceSearch]=useState("")

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const { data: blogsData, isLoading } = useGetBlogsQuery({
    page,
    limit: 3,
    search :debounceSearch,
  });

  const handleCreateBlog = () => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/create-blog");
    }
  };
  useEffect(()=>{
    let timer = setTimeout(()=>{
        setDebounceSearch(search)
    },500)
    return ()=>clearTimeout(timer)
  })

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Not Logged In - Show Login/Register Page
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">BlogApp</h1>
          <p className="text-xl mb-8">Welcome to our blog platform</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard View
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <nav className="bg-gray-800 text-white shadow-md p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setAdminTab("users")}
              className={`px-6 py-2 rounded font-semibold transition ${
                adminTab === "users"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              Manage Users
            </button>
            <button
              onClick={() => setAdminTab("blogs")}
              className={`px-6 py-2 rounded font-semibold transition ${
                adminTab === "blogs"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              Manage Blogs
            </button>
          </div>

          {/* Content */}
          <div>
            {adminTab === "users" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">User Management</h2>
                <UserManagement />
              </div>
            )}
            {adminTab === "blogs" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog Management</h2>
                <BlogManagement />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Regular User Blog View
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">BlogApp</h1>
          <div className="space-x-4">
            <button
              onClick={handleCreateBlog}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Create Blog
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Search and Filter */}
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          {/* <input
            type="text"
            placeholder="Filter by category..."
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="w-full border border-gray-300 rounded-lg p-2"
          /> */}
        </div>

        {/* Blogs List */}
        {isLoading ? (
          <p className="text-center text-gray-600">Loading blogs...</p>
        ) : blogsData?.data?.length > 0 ? (
          <div className="space-y-4">
            {blogsData.data.map((blog) => (
              <div key={blog._id} className="bg-white rounded-lg shadow p-6">
                {blog.image && (
                  <img
                    src={`http://3.111.0.97/uploads/${blog.image}`}
                    alt={blog.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-gray-800">{blog.title}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  By {blog.author?.name} | Category: {blog.category}
                </p>
                <p className="text-gray-700">{blog.description}</p>
                {/* <button
                  onClick={() => navigate(`/blog/${blog._id}`)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Read More
                </button> */}
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {blogsData?.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === blogsData?.totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">No blogs found</p>
        )}
      </div>
    </div>
  );
}
       