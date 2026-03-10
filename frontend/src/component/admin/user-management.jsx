import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from "../../redux/api/user-api";
import { useState } from "react";

export default function UserManagement() {
  const { data: usersData, isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleUpdate = async (id) => {
    const res = await updateUser({ id, ...editForm });
    if (res.data?.status) {
      alert("User updated successfully!");
      setEditingId(null);
    } else {
      alert(res.data?.message || "Failed to update user");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const res = await deleteUser(id);
      if (res.data?.status) {
        alert("User deleted successfully!");
      } else {
        alert(res.data?.message || "Failed to delete user");
      }
    }
  };

  if (isLoading) return <p className="text-center p-4">Loading users...</p>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {usersData?.data?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-left">Role</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersData.data.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border p-3">
                    {editingId === user._id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded p-2"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="border p-3">
                    {editingId === user._id ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded p-2"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="border p-3">
                    {editingId === user._id ? (
                      <select
                        value={editForm.role}
                        onChange={(e) =>
                          setEditForm({ ...editForm, role: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded p-2"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-white ${
                          user.role === "admin" ? "bg-red-500" : "bg-green-500"
                        }`}
                      >
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="border p-3 text-center space-x-2">
                    {editingId === user._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(user._id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(user)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No users found</p>
      )}
    </div>
  );
}
