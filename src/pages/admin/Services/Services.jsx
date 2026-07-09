import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllServicesAdmin, deleteService } from "../../../api/serviceApi";
import { toast } from "react-hot-toast";
import { Plus, Edit, Trash2, Wrench, ImageIcon } from "lucide-react";

const AdminServices = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const { data: services, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: getAllServicesAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-services"]);
      toast.success("Service deleted successfully");
      setShowDeleteModal(false);
      setDeletingId(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete service");
    },
  });

  const formatCurrency = (amount) => {
    return `₦${amount?.toLocaleString() || 0}`;
  };

  const filteredServices = services?.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage individual services that can be added to packages
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/services/create")}
          className="bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Create Service
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
        />
      </div>

      {filteredServices.length === 0 ? (
        <div className="bg-white/5 p-12 rounded-xl shadow text-center border border-neutral-800">
          <div className="text-6xl mb-4">🔧</div>
          <p className="text-gray-400 text-lg">
            {searchTerm ? "No services found matching your search" : "No services created yet"}
          </p>
          <button
            onClick={() => navigate("/admin/services/create")}
            className="mt-4 bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            Create Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service._id}
              className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-amber-500/50 transition-all duration-300"
            >
              {/* ✅ Image - Show actual image if exists */}
              <div className="aspect-[16/9] bg-neutral-800 overflow-hidden">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600 flex-col gap-2">
                    <Wrench size={48} />
                    <span className="text-sm text-neutral-500">No image</span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white truncate">{service.name}</h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${service.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                  {service.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-amber-400 font-bold">{formatCurrency(service.price)}</span>
                  {service.category && (
                    <span className="text-gray-400">{service.category}</span>
                  )}
                </div>

                {service.duration && (
                  <p className="text-xs text-gray-500 mt-1">⏱️ {service.duration}</p>
                )}

                <div className="mt-4 flex gap-2 pt-4 border-t border-neutral-800">
                  <button
                    onClick={() => navigate(`/admin/services/${service._id}/edit`)}
                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm transition flex items-center justify-center gap-1"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeletingId(service._id);
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-4 py-2 rounded-lg text-sm transition flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Service</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this service? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingId(null);
                  }}
                  className="flex-1 bg-neutral-800 text-white py-2 rounded-lg font-semibold hover:bg-neutral-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deletingId) {
                      deleteMutation.mutate(deletingId);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;