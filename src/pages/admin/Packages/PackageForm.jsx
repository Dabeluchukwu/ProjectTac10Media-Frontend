import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPackage, createPackage, updatePackage } from "../../../api/packageApi";
import { getServices } from "../../../api/serviceApi";
import { toast } from "react-hot-toast";
import { ArrowLeft, Save, Plus, Trash2, X } from "lucide-react";
import CloudinaryUpload from "../../../components/common/CloudinaryUpload";

const PackageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    services: [],
    features: [],
    isActive: true,
  });

  const [featureInput, setFeatureInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch package if editing
  const { data: pkg, isLoading: packageLoading } = useQuery({
    queryKey: ["package", id],
    queryFn: async () => {
      const result = await getPackage(id);
      console.log("📦 React Query - getPackage result:", result);
      return result;
    },
    enabled: isEditing,
  });

  // Fetch services for dropdown
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  // ✅ Populate form when editing - FIXED
  useEffect(() => {
    if (pkg && isEditing) {
      console.log("📦 Full pkg from React Query:", pkg);
      
      // ✅ Extract the actual package data
      // The response might be nested in different ways
      let packageData = pkg;
      
      // If pkg has a data property that contains the actual data
      if (pkg.data && pkg.data.data) {
        packageData = pkg.data.data;
      } else if (pkg.data) {
        packageData = pkg.data;
      }
      
      console.log("📦 Extracted package data:", packageData);
      
      const serviceIds = packageData.services?.map((s) => s._id || s) || [];
      console.log("📦 Service IDs:", serviceIds);
      
      setFormData({
        name: packageData.name || "",
        description: packageData.description || "",
        price: packageData.price || 0,
        image: packageData.image || "",
        services: serviceIds,
        features: packageData.features || [],
        isActive: packageData.isActive !== undefined ? packageData.isActive : true,
      });
    }
  }, [pkg, isEditing]);

  const createMutation = useMutation({
    mutationFn: createPackage,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-packages"]);
      toast.success("Package created successfully!");
      navigate("/admin/packages");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create package");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updatePackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-packages"]);
      queryClient.invalidateQueries(["package", id]);
      toast.success("Package updated successfully!");
      navigate("/admin/packages");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update package");
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleServiceToggle = (serviceId) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

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

  if (packageLoading || servicesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const availableServices = services?.data?.data || [];

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/admin/packages")}
          className="text-gray-400 hover:text-white transition flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back to Packages
        </button>
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Package" : "Create Package"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Package Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                placeholder="e.g., Standard Package"
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
                placeholder="What does this package include?"
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
                <CloudinaryUpload
                  value={formData.image}
                  onChange={handleImageUpload}
                  onRemove={handleImageRemove}
                  label="Package Image"
                  folder="packages"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services Selection */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <h2 className="text-xl font-semibold mb-4">Select Services</h2>
          <p className="text-sm text-gray-400 mb-4">
            Choose the services included in this package
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableServices.map((service) => (
              <label
                key={service._id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                  formData.services.includes(service._id)
                    ? "bg-amber-500/20 border-amber-500"
                    : "bg-neutral-800 border-neutral-700 hover:border-neutral-600"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.services.includes(service._id)}
                  onChange={() => handleServiceToggle(service._id)}
                  className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm text-white">{service.name}</span>
              </label>
            ))}
          </div>

          {availableServices.length === 0 && (
            <p className="text-gray-400 text-center py-4">
              No services available. Create services first.
            </p>
          )}
        </div>

        {/* Features */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <h2 className="text-xl font-semibold mb-4">Features</h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder="Add a feature (e.g., Drone Coverage)"
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddFeature();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature, index) => (
              <span
                key={index}
                className="flex items-center gap-2 bg-neutral-800 px-3 py-1.5 rounded-lg text-sm text-white border border-neutral-700"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>

          {formData.features.length === 0 && (
            <p className="text-gray-400 text-sm mt-2">No features added yet</p>
          )}
        </div>

        {/* Active Status */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Active Status</h3>
              <p className="text-sm text-gray-400">
                {formData.isActive
                  ? "Package is visible to clients"
                  : "Package is hidden from clients"}
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

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/packages")}
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
              ? "Update Package"
              : "Create Package"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PackageForm;