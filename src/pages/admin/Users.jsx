import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  createInstructor,
} from "../../api/userApi";
import { toast } from "react-hot-toast";
import { UserPlus, X } from "lucide-react";

const AdminUsers = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["all-users", selectedRole],
    queryFn: () => getAllUsers({ role: selectedRole }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users"]);
      toast.success("User role updated successfully");
    },
    onError: () => {
      toast.error("Failed to update user role");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users"]);
      toast.success("User deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  const createInstructorMutation = useMutation({
    mutationFn: createInstructor,
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users"]);
      toast.success("Instructor created successfully!");
      setShowCreateModal(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
      });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create instructor",
      );
    },
  });

  const roles = ["all", "student", "client", "instructor", "admin"];

  const getRoleColor = (role) => {
    const colors = {
      student: "bg-blue-500/20 text-blue-400",
      client: "bg-purple-500/20 text-purple-400",
      instructor: "bg-green-500/20 text-green-400",
      admin: "bg-red-500/20 text-red-400",
      superAdmin: "bg-amber-500/20 text-amber-400",
    };
    return colors[role] || "bg-gray-500/20 text-gray-400";
  };

  const handleCreateInstructor = (e) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    createInstructorMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="text-gray-400">Loading users...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition flex items-center gap-2"
          >
            <UserPlus size={20} />
            Create Instructor
          </button>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">All Roles</option>
            {roles
              .filter((r) => r !== "all")
              .map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Create Instructor Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Create Instructor
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateInstructor} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-neutral-800 text-white py-2 rounded-lg font-semibold hover:bg-neutral-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createInstructorMutation.isPending}
                  className="flex-1 bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50"
                >
                  {createInstructorMutation.isPending
                    ? "Creating..."
                    : "Create Instructor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Table */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800 border-b border-neutral-700">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-400">
                  User
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">
                  Email
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">
                  Role
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">
                  Joined
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-neutral-800 hover:bg-neutral-800/50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-lg">
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        {user.phone && (
                          <p className="text-xs text-gray-400">{user.phone}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-300">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded ${getRoleColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {user.role !== "superAdmin" && (
                        <>
                          <select
                            value={user.role}
                            onChange={(e) => {
                              if (
                                window.confirm(
                                  `Change ${user.firstName}'s role to ${e.target.value}?`,
                                )
                              ) {
                                updateRoleMutation.mutate({
                                  userId: user._id,
                                  role: e.target.value,
                                });
                              }
                            }}
                            className="bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-amber-500"
                          >
                            {roles
                              .filter((r) => r !== "all")
                              .map((role) => (
                                <option key={role} value={role}>
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                              ))}
                          </select>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Delete ${user.firstName} ${user.lastName}? This cannot be undone.`,
                                )
                              ) {
                                deleteUserMutation.mutate(user._id);
                              }
                            }}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {user.role === "superAdmin" && (
                        <span className="text-xs text-gray-500">Protected</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users?.length === 0 && (
          <div className="p-8 text-center text-gray-400">No users found</div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
