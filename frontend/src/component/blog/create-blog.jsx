import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateBlogMutation } from "../../redux/api/blog-api";

export default function CreateBlog() {
  const navigate = useNavigate();
  const [createBlog] = useCreateBlogMutation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await createBlog(form);

      if (res.data?.status) {
        alert("Blog created successfully!");
        navigate("/");
      } else {
        alert(res.data?.message || "Failed to create blog");
      }
    } catch (error) {
      alert("Error creating blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Blog</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Blog title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              placeholder="Blog category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Blog description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({ ...form, image: e.target.files?.[0] })
              }
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
          >
            {isSubmitting ? "Creating..." : "Create Blog"}
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
