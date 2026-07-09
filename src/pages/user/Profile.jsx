import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Camera, Trash2, Save, Eye, EyeOff } from "lucide-react";
import useAuthStore from "../../store/authStore";
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePhoto,
  removeProfilePhoto,
} from "../../api/userApi";

const Profile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: authUser } = useAuthStore();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    profileImage: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ✅ Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  // ✅ Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        email: profile.email || "",
        profileImage: profile.profileImage || null,
      });
      setAvatarPreview(profile.profileImage || null);
    }
  }, [profile]);

  // ✅ Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["profile"]);
      // Update auth store with new user data
      useAuthStore.setState({ user: data });
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });

  // ✅ Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to change password");
    },
  });

  // ✅ Upload photo mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: uploadProfilePhoto,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["profile"]);
      setAvatarPreview(data.url);
      toast.success("Profile photo updated!");
      setIsUploading(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to upload photo");
      setIsUploading(false);
    },
  });

  // ✅ Remove photo mutation
  const removePhotoMutation = useMutation({
    mutationFn: removeProfilePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      setAvatarPreview(null);
      setAvatarFile(null);
      toast.success("Profile photo removed");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to remove photo");
    },
  });

  const handleAvatarChange = (e) => {
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

  setAvatarFile(file);
  const reader = new FileReader();
  reader.onload = () => {
    setAvatarPreview(reader.result);
  };
  reader.readAsDataURL(file);

  // ✅ Check if Cloudinary cloud name is set
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    toast.error("Cloudinary is not configured. Please contact support.");
    setIsUploading(false);
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "profile_photos");

  setIsUploading(true);
  
  const cloudinaryUpload = async () => {
    try {
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      
      const cloudinaryData = await cloudinaryResponse.json();

      if (!cloudinaryResponse.ok) {
        console.error("Cloudinary error:", cloudinaryData);
        throw new Error(cloudinaryData.error?.message || "Upload failed");
      }

      // Save to database
      uploadPhotoMutation.mutate({
        url: cloudinaryData.secure_url,
        publicId: cloudinaryData.public_id,
        filename: file.name,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
      setIsUploading(false);
      setAvatarPreview(profile?.profileImage || null);
    }
  };

  cloudinaryUpload();
};

  const handleRemovePhoto = () => {
    if (window.confirm("Are you sure you want to remove your profile photo?")) {
      removePhotoMutation.mutate();
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Profile & Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Photo */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-32 h-32 rounded-full bg-neutral-700 overflow-hidden flex items-center justify-center">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                ) : avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-gray-500">
                    {formData.firstName?.[0] || "?"}
                    {formData.lastName?.[0] || ""}
                  </span>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-amber-500 text-black p-2 rounded-full cursor-pointer hover:bg-amber-600 transition"
              >
                <Camera size={16} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={isUploading}
              />
            </div>

            <div className="space-y-2">
              <p className="text-white font-medium">
                {formData.firstName} {formData.lastName}
              </p>
              <p className="text-sm text-gray-400">{formData.email}</p>
              <p className="text-xs text-amber-400 capitalize">{authUser?.role}</p>
            </div>

            {avatarPreview && (
              <button
                onClick={handleRemovePhoto}
                disabled={removePhotoMutation.isPending}
                className="mt-4 text-red-400 hover:text-red-300 text-sm transition flex items-center justify-center gap-2"
              >
                <Trash2 size={14} />
                {removePhotoMutation.isPending ? "Removing..." : "Remove Photo"}
              </button>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 mt-4">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Account Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Role</span>
                <span className="text-white capitalize">{authUser?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white">
                  {new Date(authUser?.createdAt).toLocaleDateString()}
                </span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-gray-400">Verified</span>
                <span className={authUser?.isVerified ? "text-green-400" : "text-yellow-400"}>
                  {authUser?.isVerified ? "✅ Yes" : "⏳ Pending"}
                </span>
              </div> */}
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info Form */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  placeholder="+234 800 000 0000"
                />
              </div>

              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={18} />
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {passwordData.newPassword && passwordData.confirmPassword && (
                <p className={`text-sm ${
                  passwordData.newPassword === passwordData.confirmPassword
                    ? "text-green-400"
                    : "text-red-400"
                }`}>
                  {passwordData.newPassword === passwordData.confirmPassword
                    ? "✅ Passwords match"
                    : "❌ Passwords do not match"}
                </p>
              )}

              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50"
              >
                {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;