import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdmin, getAllUsers } from "../../api/userApi";
import { toast } from "react-hot-toast";

const Admins = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "admin",
  });
  
  const queryClient = useQueryClient();

  const { data: admins, isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: () => getAllUsers({ role: "admin" }),
  });

  const createAdminMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(["admins"]);
      queryClient.invalidateQueries(["all-users"]);
      toast.success("Admin created successfully");
      setShowForm(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        role: "admin",
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create admin");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createAdminMutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
        >
          {showForm ? "✕ Cancel" : "+ Create Admin"}
        </button>
      </div>

      {/* Create Admin Form */}
      {showForm && (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Admin Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={createAdminMutation.isPending}
              className="w-full bg-amber-500 text-black py-3 rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50"
            >
              {createAdminMutation.isPending ? "Creating..." : "Create Admin"}
            </button>
          </form>
        </div>
      )}

      {/* Admin List */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800 border-b border-neutral-700">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Admin</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Email</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Phone</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Created</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Role</th>
              </tr>
            </thead>
            <tbody>
              {admins?.map((admin) => (
                <tr key={admin._id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center">
                        {admin.firstName?.[0]}{admin.lastName?.[0]}
                      </div>
                      <p className="font-medium">{admin.firstName} {admin.lastName}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-300">{admin.email}</td>
                  <td className="p-4 text-sm text-gray-300">{admin.phone || "—"}</td>
                  <td className="p-4 text-sm text-gray-400">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">
                      {admin.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {admins?.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No admins found. Create one above.
          </div>
        )}
      </div>
    </div>
  );
};

export default Admins;