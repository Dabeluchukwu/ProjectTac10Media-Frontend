import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getVacancies, 
  createVacancy, 
  updateVacancy, 
  deleteVacancy,
  getApplicationsByVacancy,
  updateApplicationStatus,
  deleteApplication
} from "../../api/jobApi";
import { toast } from "react-hot-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  FileText
} from "lucide-react";

const AdminJobs = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("vacancies"); // "vacancies" or "applications"
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    budget: 0,
    applicationDeadline: "",
    status: "open",
  });

  // Fetch all vacancies
  const { data: vacancies, isLoading: vacanciesLoading } = useQuery({
    queryKey: ["admin-vacancies"],
    queryFn: getVacancies,
  });

  // Fetch applications for selected vacancy
  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["applications", selectedVacancy?._id],
    queryFn: () => getApplicationsByVacancy(selectedVacancy?._id),
    enabled: !!selectedVacancy?._id,
  });

  const vacanciesArray = Array.isArray(vacancies) ? vacancies : [];
  const applicationsArray = Array.isArray(applications) ? applications : [];

 const createMutation = useMutation({
  mutationFn: createVacancy,
  onSuccess: () => {
    // ✅ Invalidate and refetch vacancies
    queryClient.invalidateQueries({ queryKey: ["admin-vacancies"] });
    // ✅ Also refetch immediately
    queryClient.refetchQueries({ queryKey: ["admin-vacancies"] });
    toast.success("Job vacancy created successfully!");
    setShowCreateModal(false);
    resetForm();
  },
  onError: (error) => {
    toast.error(error?.response?.data?.message || "Failed to create job");
  },
});

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateVacancy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-vacancies"]);
      toast.success("Job vacancy updated successfully!");
      setShowEditModal(false);
      setEditingJob(null);
      resetForm();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update job");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteVacancy,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-vacancies"]);
      toast.success("Job vacancy deleted successfully!");
      setShowDeleteConfirm(false);
      setDeletingId(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete job");
    },
  });

  // Update application status mutation
  const updateAppStatusMutation = useMutation({
    mutationFn: ({ applicationId, status }) => updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["applications", selectedVacancy?._id]);
      toast.success("Application status updated successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update application status");
    },
  });

  // Delete application mutation
  const deleteAppMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries(["applications", selectedVacancy?._id]);
      toast.success("Application deleted successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete application");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      budget: 0,
      applicationDeadline: "",
      status: "open",
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate({ id: editingJob._id, data: formData });
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || "",
      description: job.description || "",
      category: job.category || "",
      location: job.location || "",
      budget: job.budget || 0,
      applicationDeadline: job.applicationDeadline ? job.applicationDeadline.split('T')[0] : "",
      status: job.status || "open",
    });
    setShowEditModal(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-green-500/20 text-green-400",
      closed: "bg-red-500/20 text-red-400",
      filled: "bg-blue-500/20 text-blue-400",
    };
    return styles[status] || "bg-gray-500/20 text-gray-400";
  };

  const getAppStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-400",
      accepted: "bg-green-500/20 text-green-400",
      rejected: "bg-red-500/20 text-red-400",
    };
    return styles[status] || "bg-gray-500/20 text-gray-400";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `₦${amount?.toLocaleString() || 0}`;
  };

  if (vacanciesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Job Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage job vacancies and applications
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Post New Job
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-neutral-800 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab("vacancies")}
          className={`px-6 py-2 rounded-lg transition ${
            activeTab === "vacancies"
              ? "bg-amber-500 text-black"
              : "hover:bg-neutral-700 text-gray-400"
          }`}
        >
          <Briefcase size={18} className="inline mr-2" />
          Vacancies ({vacanciesArray.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("applications");
            if (vacanciesArray.length > 0) {
              setSelectedVacancy(vacanciesArray[0]);
            }
          }}
          className={`px-6 py-2 rounded-lg transition ${
            activeTab === "applications"
              ? "bg-amber-500 text-black"
              : "hover:bg-neutral-700 text-gray-400"
          }`}
        >
          <Users size={18} className="inline mr-2" />
          Applications
        </button>
      </div>

      {/* Vacancies Tab */}
      {activeTab === "vacancies" && (
        <>
          {vacanciesArray.length === 0 ? (
            <div className="bg-white/5 p-12 rounded-xl shadow text-center border border-neutral-800">
              <div className="text-6xl mb-4">💼</div>
              <p className="text-gray-400 text-lg">No job vacancies yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Post your first job vacancy
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
              >
                Post New Job
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vacanciesArray.map((job) => (
                <div
                  key={job._id}
                  className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-amber-500/50 transition-all duration-300"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(job.status)}`}>
                        {job.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{job.description}</p>

                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Briefcase size={14} />
                        <span>{job.category}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin size={14} />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <DollarSign size={14} />
                        <span>{formatCurrency(job.budget)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={14} />
                        <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users size={14} />
                        <span>{job.applicationCount || 0} applications</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-800">
                      <button
                        onClick={() => {
                          setSelectedVacancy(job);
                          setActiveTab("applications");
                        }}
                        className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-2 rounded-lg text-sm transition flex items-center justify-center gap-1"
                      >
                        <Users size={14} />
                        View Apps
                      </button>
                      <button
                        onClick={() => openEditModal(job)}
                        className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-2 rounded-lg text-sm transition flex items-center gap-1"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeletingId(job._id);
                          setShowDeleteConfirm(true);
                        }}
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-2 rounded-lg text-sm transition flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <div>
          {vacanciesArray.length === 0 ? (
            <div className="bg-white/5 p-12 rounded-xl shadow text-center border border-neutral-800">
              <p className="text-gray-400 text-lg">No vacancies to view applications for</p>
              <p className="text-gray-500 text-sm mt-2">Post a job first</p>
            </div>
          ) : (
            <>
              {/* Vacancy selector */}
              <div className="mb-4">
                <select
                  value={selectedVacancy?._id || ""}
                  onChange={(e) => {
                    const job = vacanciesArray.find((j) => j._id === e.target.value);
                    setSelectedVacancy(job);
                  }}
                  className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 w-full md:w-auto"
                >
                  {vacanciesArray.map((job) => (
                    <option key={job._id} value={job._id}>
                      {job.title} ({job.status})
                    </option>
                  ))}
                </select>
              </div>

              {applicationsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                </div>
              ) : applicationsArray.length === 0 ? (
                <div className="bg-white/5 p-12 rounded-xl shadow text-center border border-neutral-800">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-400 text-lg">No applications yet</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Applications will appear here when users apply
                  </p>
                </div>
              ) : (
                <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-neutral-800 border-b border-neutral-700">
                        <tr>
                          <th className="text-left p-4 text-sm font-medium text-gray-400">Applicant</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-400">Message</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-400">Applied</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applicationsArray.map((app) => (
                          <tr key={app._id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                            <td className="p-4">
                              <div>
                                <p className="font-medium">
                                  {app.applicant?.firstName} {app.applicant?.lastName}
                                </p>
                                <p className="text-xs text-gray-400">{app.applicant?.email}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="text-sm text-gray-300 line-clamp-2 max-w-[200px]">
                                {app.message || "No message"}
                              </p>
                            </td>
                            <td className="p-4">
                              <span className={`text-xs px-2 py-1 rounded ${getAppStatusBadge(app.status)}`}>
                                {app.status || "pending"}
                              </span>
                            </td>
                            <td className="p-4 text-sm text-gray-400">
                              {formatDate(app.createdAt)}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <select
                                  value={app.status || "pending"}
                                  onChange={(e) => {
                                    updateAppStatusMutation.mutate({
                                      applicationId: app._id,
                                      status: e.target.value,
                                    });
                                  }}
                                  className="bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-amber-500"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="accepted">Accepted</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                                <button
                                  onClick={() => {
                                    if (window.confirm("Delete this application?")) {
                                      deleteAppMutation.mutate(app._id);
                                    }
                                  }}
                                  className="text-red-400 hover:text-red-300 text-sm"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Post New Job</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g., Cinematographer Needed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  placeholder="Job description, requirements, responsibilities..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g., Film, Photography, Editing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g., Lagos, Nigeria"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Budget</label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Application Deadline *</label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-neutral-800 text-white py-2 rounded-lg font-semibold hover:bg-neutral-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50"
                >
                  {createMutation.isPending ? "Creating..." : "Post Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditModal && editingJob && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Edit Job</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingJob(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Same form fields as create */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Budget</label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Application Deadline *</label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingJob(null);
                    resetForm();
                  }}
                  className="flex-1 bg-neutral-800 text-white py-2 rounded-lg font-semibold hover:bg-neutral-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50"
                >
                  {updateMutation.isPending ? "Updating..." : "Update Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Job</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this job? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
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

export default AdminJobs;