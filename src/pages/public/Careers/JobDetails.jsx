import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getVacancyById } from "../../../api/jobApi";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Building,
  Send,
  X,
  Mail,
  Phone,
  User,
  Check,
  AlertCircle,
} from "lucide-react";
import useAuthStore from "../../../store/authStore";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAlreadyAppliedModal, setShowAlreadyAppliedModal] = useState(false); // ✅ New modal
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getVacancyById(id),
  });

  // Check if user has already applied (ONLY for logged-in users)
  useEffect(() => {
    const checkApplication = async () => {
      if (!job) return;

      if (!user) {
        setHasApplied(false);
        setCheckingApplication(false);
        return;
      }

      setCheckingApplication(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/job-applications/check?vacancy=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setHasApplied(data.hasApplied || false);
        }
      } catch (error) {
        console.error("Error checking application:", error);
      } finally {
        setCheckingApplication(false);
      }
    };

    checkApplication();
  }, [id, user, job]);

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

  const handleApply = () => {
    if (hasApplied) {
      toast.info("You have already applied for this position");
      return;
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
    setShowApplyModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Check if email already applied (for guests)
  const checkIfEmailAlreadyApplied = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/job-applications/check-by-email?vacancy=${id}&email=${encodeURIComponent(email)}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        return data.hasApplied || false;
      }
      return false;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleSubmitApplication = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.message || formData.message.trim().length < 10) {
      toast.error("Please write a message (at least 10 characters)");
      return;
    }

    // For guests, check if email already applied BEFORE submitting
    if (!user) {
      const alreadyApplied = await checkIfEmailAlreadyApplied(formData.email);
      if (alreadyApplied) {
        // ✅ Show the modal instead of just a toast
        setShowAlreadyAppliedModal(true);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const applicationData = {
        vacancy: id,
        message: formData.message.trim(),
        attachment: null,
        applicantDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || "",
        },
      };

      const headers = {
        "Content-Type": "application/json",
      };

      if (user) {
        headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
      }

      const response = await fetch(
        "http://localhost:5000/api/v1/job-applications",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(applicationData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSubmittedData({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          jobTitle: job?.title,
        });

        setShowApplyModal(false);
        setHasApplied(true);

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });

        setShowSuccessModal(true);
      } else {
        toast.error(data.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || checkingApplication) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex flex-col items-center justify-center p-6">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-amber-400 mb-4">
          Job Not Found
        </h2>
        <p className="text-gray-400 mb-6">
          The job you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/careers")}
          className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
        >
          Back to Careers
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/careers")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
        >
          <ArrowLeft size={20} />
          Back to Careers
        </button>

        {/* Job Header */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Briefcase size={16} />
                  {job.category || "General"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {job.location || "Remote"}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={16} />
                  {formatCurrency(job.budget)}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    job.status === "open"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {job.status === "open" ? "🟢 Open" : "🔴 Closed"}
                </span>
              </div>
            </div>
            {job.postedBy && (
              <div className="text-right">
                <p className="text-sm text-gray-400">Posted by</p>
                <p className="text-white font-medium">
                  {job.postedBy?.firstName} {job.postedBy?.lastName}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Job Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/10 p-2 rounded-lg">
                <Calendar size={20} className="text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Application Deadline</p>
                <p className="text-white font-medium">
                  {job.applicationDeadline
                    ? formatDate(job.applicationDeadline)
                    : "No deadline"}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Building size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="text-white font-medium">
                  {job.location || "Remote"}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/10 p-2 rounded-lg">
                <Clock size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <p
                  className={`font-medium ${
                    job.status === "open" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {job.status === "open" ? "Accepting Applications" : "Closed"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Already Applied Alert - Only for logged-in users */}
        {hasApplied && user && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle size={24} className="text-green-400 flex-shrink-0" />
            <div>
              <p className="text-green-400 font-medium">
                You have already applied for this position
              </p>
              <p className="text-gray-400 text-sm">
                Your application is being reviewed. We'll contact you soon!
              </p>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Job Description</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-wrap">
              {job.description}
            </p>
          </div>
        </div>

        {/* Apply Button */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">
              {job.status === "open" ? (
                <span className="flex items-center gap-1">
                  <CheckCircle size={16} className="text-green-400" />
                  This position is currently open
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <XCircle size={16} className="text-red-400" />
                  This position is currently closed
                </span>
              )}
            </p>
          </div>
          {job.status === "open" && (
            <button
              onClick={handleApply}
              disabled={hasApplied && !!user}
              className={`px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                hasApplied && user
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-amber-500 text-black hover:bg-amber-600"
              }`}
            >
              {hasApplied && user ? (
                <>
                  <Check size={18} />
                  Already Applied
                </>
              ) : (
                <>
                  <Send size={18} />
                  Apply Now
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Apply for {job.title}
              </h2>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-4 p-3 bg-neutral-800 rounded-lg">
              <p className="text-sm text-gray-400">You are applying for</p>
              <p className="text-white font-medium">{job.title}</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitApplication();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
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
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    placeholder="John"
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
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    placeholder="080 1234 5678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Cover Letter / Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  placeholder="Tell us why you're the right person for this job..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.message.length} characters (minimum 10 required)
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 bg-neutral-800 text-white py-2 rounded-lg font-semibold hover:bg-neutral-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Already Applied Modal (for guests) */}
      {showAlreadyAppliedModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-amber-400 mb-2">
              Already Applied
            </h2>
            <p className="text-gray-400 mb-2">
              You have already applied for{" "}
              <span className="text-white font-medium">{job?.title}</span> with the email{" "}
              <span className="text-amber-400 font-medium">{formData.email}</span>.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Your application is being reviewed. We'll contact you at that email address.
            </p>

            <div className="bg-neutral-800 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-400">If you need to update your application,</p>
              <p className="text-sm text-gray-400">please contact us at:</p>
              <p className="text-amber-400 font-medium mt-1">support@example.com</p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowAlreadyAppliedModal(false);
                  setShowApplyModal(false);
                }}
                className="w-full bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && submittedData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">
              Application Submitted!
            </h2>
            <p className="text-gray-400 mb-2">
              Your application for{" "}
              <span className="text-white font-medium">{submittedData.jobTitle}</span> has
              been successfully submitted.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              We'll review your application and get back to you soon.
            </p>

            <div className="bg-neutral-800 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-400">Application Details</p>
              <div className="mt-2 space-y-1 text-sm">
                <p className="text-white">
                  {submittedData.firstName} {submittedData.lastName}
                </p>
                <p className="text-gray-400">{submittedData.email}</p>
                {submittedData.phone && (
                  <p className="text-gray-400">{submittedData.phone}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setSubmittedData(null);
                  navigate("/careers");
                }}
                className="w-full bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
              >
                Back to Careers
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setSubmittedData(null);
                }}
                className="w-full bg-neutral-800 text-white py-2 rounded-lg font-semibold hover:bg-neutral-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;