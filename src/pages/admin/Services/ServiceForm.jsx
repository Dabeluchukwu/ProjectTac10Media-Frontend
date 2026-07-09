import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getService, createService, updateService } from "../../../api/serviceApi";
import { toast } from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import CloudinaryUpload from "../../../components/common/CloudinaryUpload";

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
    duration: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  // Fetch service if editing
  const { data: service, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: () => getService(id),
    enabled: isEditing,
  });

  // Populate form when editing
  useEffect(() => {
    if (service && isEditing) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        price: service.price || 0,
        image: service.image || "",
        category: service.category || "",
        duration: service.duration || "",
        isActive: service.isActive !== undefined ? service.isActive : true,
      });
    }
  }, [service, isEditing]);

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-services"]);
      toast.success("Service created successfully!");
      navigate("/admin/services");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create service");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-services"]);
      queryClient.invalidateQueries(["service", id]);
      toast.success("Service updated successfully!");
      navigate("/admin/services");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update service");
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Handle image upload
  const handleImageUpload = (url) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
    }));
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = {
      ...formData,
      price: Number(formData.price),
    };

    if (isEditing) {
      updateMutation.mutate({ id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
    setLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/admin/services")}
          className="text-gray-400 hover:text-white transition flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back to Services
        </button>
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Service" : "Create Service"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <h2 className="text-xl font-semibold mb-4">Service Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Service Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                placeholder="e.g., Photography"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                placeholder="Describe the service"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Price (₦) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g., Photography, Video"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g., 2 hours"
                />
              </div>
              <div>
                {/* ✅ Image Upload */}
                <CloudinaryUpload
                  value={formData.image}
                  onChange={handleImageUpload}
                  onRemove={handleImageRemove}
                  label="Service Image"
                  folder="services"
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              <div>
                <h3 className="font-semibold">Active Status</h3>
                <p className="text-sm text-gray-400">
                  {formData.isActive
                    ? "Service is visible to clients"
                    : "Service is hidden from clients"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-700 peer-focus:ring-2 peer-focus:ring-amber-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/services")}
            className="px-6 py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:bg-neutral-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || createMutation.isPending || updateMutation.isPending}
            className="px-6 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={18} />
            {loading || createMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : isEditing
              ? "Update Service"
              : "Create Service"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;