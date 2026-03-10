import { useParams, useNavigate } from "react-router-dom";
import { useGetBlogByIdQuery, useDeleteBlogMutation, useUpdateBlogMutation } from "../../redux/api/blog-api";
import { useState } from "react";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: blogData, isLoading } = useGetBlogByIdQuery(id);
  const [deleteBlog] = useDeleteBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      const res = await deleteBlog(id);
      if (res.data?.status) {
        alert("Blog deleted successfully!");
        navigate("/");
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setForm({
      title: blogData?.data?.title || "",
      description: blogData?.data?.description || "",
      category: blogData?.data?.category || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await updateBlog({ id, ...form });
    if (res.data?.status) {
      alert("Blog updated successfully!");
      setIsEditing(false);
      window.location.reload();
    }
  };

  if (isLoading) return <p className="text-center p-4">Loading...</p>;

  const blog = blogData?.data;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {!isEditing ? (
          <>
            {blog?.image && (
              <img
                src={`http://3.111.0.97/uploads/${blog.image}`}
                alt={blog?.title}
                className="w-full h-96 object-cover rounded-lg mb-6"
              />
            )}
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {blog?.title}
            </h1>
            <p className="text-gray-600 text-sm mb-4">
              By {blog?.author?.name} | Category: {blog?.category}
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {blog?.description}
            </p>

            <div className="space-x-4">
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Back
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-6">
            <h2 className="text-2xl font-bold">Edit Blog</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 h-40"
                required
              />
            </div>

            <div className="space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
