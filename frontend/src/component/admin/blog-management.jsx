import { useGetBlogsQuery, useDeleteBlogMutation, useUpdateBlogMutation } from "../../redux/api/blog-api";
import { useState } from "react";

export default function BlogManagement() {
  const { data: blogsData, isLoading } = useGetBlogsQuery();
  console.log("🚀 ~ BlogManagement ~ blogsData:", blogsData)
  
  const [deleteBlog] = useDeleteBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setEditForm({
      title: blog.title,
      description: blog.description,
      category: blog.category,
    });
  };

  const handleUpdate = async (id) => {
    const res = await updateBlog({ id, ...editForm });
    if (res.data?.status) {
      alert("Blog updated successfully!");
      setEditingId(null);
    } else {
      alert(res.data?.message || "Failed to update blog");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      const res = await deleteBlog(id);
      if (res.data?.status) {
        alert("Blog deleted successfully!");
      } else {
        alert(res.data?.message || "Failed to delete blog");
      }
    }
  };

  if (isLoading) return <p className="text-center p-4">Loading blogs...</p>;

  return (
    <div className="space-y-6">
      {blogsData?.data?.length > 0 ? (
        blogsData.data.map((blog) => (
          <div key={blog._id} className="bg-white rounded-lg shadow p-6">
            {!editingId || editingId !== blog._id ? (
              <>
                {blog.image && (
                  <img
                    src={`http://localhost:5000/uploads/${blog.image}`}
                    alt={blog.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  By {blog.author?.name} | Category: {blog.category}
                </p>
                <p className="text-gray-700 mb-4">{blog.description}</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(blog._id);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
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
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 h-24"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No blogs found</p>
      )}
    </div>
  );
}
