import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMyCertificates } from "../../api/certificate.api";
import { toast } from "react-hot-toast";

const Certificates = () => {
  const navigate = useNavigate();

  const { data: certificates, isLoading, error } = useQuery({
    queryKey: ["my-certificates"],
    queryFn: getMyCertificates,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your certificates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg">
        <p className="font-semibold">Failed to load certificates</p>
        <p className="text-sm mt-1">{error.message || "Please try again later"}</p>
      </div>
    );
  }

  const certs = certificates?.data?.data || certificates || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-orange-400 mb-8">My Certificates</h1>

      {certs.length === 0 ? (
        <div className="bg-white/5 p-12 rounded-xl shadow text-center border border-neutral-800">
          <div className="text-6xl mb-4">🎓</div>
          <p className="text-gray-400 text-lg">You haven't earned any certificates yet.</p>
          <p className="text-gray-500 text-sm mt-2">
            Complete courses and pass the final exam to earn certificates.
          </p>
          <button
            onClick={() => navigate("/dashboard/courses")}
            className="mt-4 bg-amber-500 px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition text-black"
          >
            View My Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <div
              key={cert._id}
              className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-amber-500/50 transition-all duration-300"
            >
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">🎓</div>
                  <h3 className="text-xl font-bold text-white">{cert.course?.title || "Course"}</h3>
                  <p className="text-sm text-gray-400">Certificate of Completion</p>
                </div>

                <div className="border-t border-neutral-800 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Certificate Number</span>
                    <span className="text-white font-mono text-xs">{cert.certificateNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Issued Date</span>
                    <span className="text-white">
                      {new Date(cert.issuedAt || cert.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-400">✅ Valid</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    toast.info("Certificate download coming soon!");
                  }}
                  className="mt-4 w-full bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
                >
                  📄 Download Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;