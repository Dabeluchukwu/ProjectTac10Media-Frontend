import { useState } from "react";
import { toast } from "react-hot-toast";
import { Upload, X } from "lucide-react";

const CloudinaryUpload = ({ value, onChange, onRemove, label = "Image", folder = "packages" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value || null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    console.log("📤 Cloudinary cloud name:", cloudName);
    if (!cloudName) {
      toast.error("Cloudinary is not configured (missing VITE_CLOUDINARY_CLOUD_NAME)");
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", folder); // uses folder name as upload preset

    setIsUploading(true);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("📦 Cloudinary response:", data);

      if (!response.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      // ✅ Pass the URL to parent
      onChange(data.secure_url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
      // Reset preview to previous value
      setPreview(value || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-4">
        {/* Image Preview */}
        {preview ? (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-neutral-700 flex-shrink-0 group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-lg border-2 border-dashed border-neutral-700 flex items-center justify-center text-gray-500 flex-shrink-0">
            <Upload size={24} />
          </div>
        )}

        {/* Upload Button */}
        <div className="flex-1">
          <label className="cursor-pointer">
            <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 hover:border-amber-500 transition">
              <span className="text-white">📤</span>
              <span className="text-sm text-gray-400">
                {isUploading ? "Uploading..." : preview ? "Change Image" : "Upload Image"}
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Max 5MB, JPG/PNG/WebP
          </p>
        </div>
      </div>
    </div>
  );
};

export default CloudinaryUpload;