import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, updateUserRole, deleteUser } from "../../api/userApi";
import { toast } from "react-hot-toast";

const Users = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const queryClient = useQueryClient();

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["all-users", selectedRole],
    queryFn: () => getAllUsers({ role: selectedRole }),
    // ✅ Add this to see what's happening
    onSuccess: (data) => {
      console.log("📊 Users fetched:", data);
    },
    onError: (error) => {
      console.error("❌ Error fetching users:", error);
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => updateUserRole(userId, role),
    onSuccess: () => {
      // ✅ Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      queryClient.refetchQueries({ queryKey: ["all-users"] });
      toast.success("User role updated successfully");
    },
    onError: (error) => {
      console.error("❌ Update role error:", error);
      toast.error(error?.response?.data?.message || "Failed to update user role");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      queryClient.refetchQueries({ queryKey: ["all-users"] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      console.error("❌ Delete user error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete user");
    },
  });

  const roles = ["all", "student", "client", "instructor", "admin", "superAdmin"];

  const getRoleColor = (role) => {
    const colors = {
      "student": "bg-blue-500/20 text-blue-400",
      "client": "bg-purple-500/20 text-purple-400",
      "instructor": "bg-green-500/20 text-green-400",
      "admin": "bg-red-500/20 text-red-400",
      "superAdmin": "bg-amber-500/20 text-amber-400",
    };
    return colors[role] || "bg-gray-500/20 text-gray-400";
  };

  // ✅ Handle filter change with logging
  const handleRoleChange = (e) => {
    const role = e.target.value;
    console.log("🔍 Filtering by role:", role);
    setSelectedRole(role);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  const usersArray = users || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-sm text-gray-400 mt-1">
            Total: {usersArray.length} users
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedRole}
            onChange={handleRoleChange}
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">All Roles</option>
            {roles.filter(r => r !== "all").map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {usersArray.length === 0 ? (
        <div className="bg-white/5 p-12 rounded-xl shadow text-center border border-neutral-800">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-gray-400 text-lg">No users found</p>
          <p className="text-gray-500 text-sm mt-2">
            {selectedRole ? `No users with role "${selectedRole}"` : "Users will appear here once they register"}
          </p>
        </div>
      ) : (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800 border-b border-neutral-700">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Email</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Joined</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersArray.map((user) => (
                  <tr key={user._id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-lg">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          {user.phone && (
                            <p className="text-xs text-gray-400">{user.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">{user.email}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {user.role !== "superAdmin" ? (
                          <>
                            <select
                              value={user.role}
                              onChange={(e) => {
                                if (window.confirm(`Change ${user.firstName}'s role to ${e.target.value}?`)) {
                                  updateRoleMutation.mutate({
                                    userId: user._id,
                                    role: e.target.value,
                                  });
                                }
                              }}
                              className="bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-amber-500"
                            >
                              {roles.filter(r => r !== "all").map((role) => (
                                <option key={role} value={role}>
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${user.firstName} ${user.lastName}? This cannot be undone.`)) {
                                  deleteUserMutation.mutate(user._id);
                                }
                              }}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-500">Protected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;