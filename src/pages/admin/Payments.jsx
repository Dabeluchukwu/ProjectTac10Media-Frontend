import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPayments } from "../../api/paymentApi";
import { 
  Search, 
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Eye
} from "lucide-react";

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;

  const { data: payments, isLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: getAllPayments,
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-400",
      success: "bg-green-500/20 text-green-400",
      failed: "bg-red-500/20 text-red-400",
    };
    return styles[status] || "bg-gray-500/20 text-gray-400";
  };

  const getTypeBadge = (type) => {
    const styles = {
      course: "bg-blue-500/20 text-blue-400",
      booking: "bg-purple-500/20 text-purple-400",
      advertisement: "bg-amber-500/20 text-amber-400",
      other: "bg-gray-500/20 text-gray-400",
    };
    return styles[type] || "bg-gray-500/20 text-gray-400";
  };

  const formatCurrency = (amount) => {
    return `₦${amount?.toLocaleString() || 0}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ Ensure payments is always an array
  const paymentsArray = Array.isArray(payments) ? payments : [];

  // Filter payments
  const filteredPayments = paymentsArray.filter((payment) => {
    const matchesSearch = 
      payment.paystackReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchesType = filterType === "all" || payment.purpose === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            Total: {filteredPayments.length} payments
          </p>
        </div>
        <button
          onClick={() => {
            // Download CSV functionality
          }}
          className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by user or reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Types</option>
          <option value="course">Course</option>
          <option value="booking">Booking</option>
          <option value="advertisement">Advertisement</option>
          <option value="other">Other</option>
        </select>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="bg-white/5 p-12 rounded-xl shadow text-center border border-neutral-800">
          <div className="text-6xl mb-4">💳</div>
          <p className="text-gray-400 text-lg">No payments found</p>
          <p className="text-gray-500 text-sm mt-2">
            Payments will appear here once users make transactions
          </p>
        </div>
      ) : (
        <>
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-800 border-b border-neutral-700">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Type</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Reference</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments.map((payment) => (
                    <tr key={payment._id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">
                            {payment.user?.firstName} {payment.user?.lastName}
                          </p>
                          <p className="text-xs text-gray-400">{payment.user?.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded ${getTypeBadge(payment.purpose)}`}>
                          {payment.purpose || "N/A"}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-medium text-amber-400">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-mono text-gray-400 truncate block max-w-[100px]">
                          {payment.paystackReference}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(payment.status)}`}>
                          {payment.status || "N/A"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowModal(true);
                          }}
                          className="text-blue-400 hover:text-blue-300 transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-400">
                Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredPayments.length)} of {filteredPayments.length}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-neutral-800 rounded-lg text-gray-400 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="px-3 py-1 bg-amber-500 text-black rounded-lg font-medium">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-neutral-800 rounded-lg text-gray-400 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Payment Details Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Payment Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">User</p>
                  <p className="text-white font-medium">
                    {selectedPayment.user?.firstName} {selectedPayment.user?.lastName}
                  </p>
                  <p className="text-sm text-gray-400">{selectedPayment.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Amount</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {formatCurrency(selectedPayment.amount)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Type</p>
                  <span className={`text-xs px-2 py-1 rounded ${getTypeBadge(selectedPayment.purpose)}`}>
                    {selectedPayment.purpose || "N/A"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(selectedPayment.status)}`}>
                    {selectedPayment.status || "N/A"}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400">Reference</p>
                <p className="text-sm font-mono text-white break-all">{selectedPayment.paystackReference}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Date</p>
                <p className="text-white">{formatDate(selectedPayment.createdAt)}</p>
              </div>

              {selectedPayment.booking && (
                <div className="bg-neutral-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Booking Details</p>
                  <p className="text-white">ID: {selectedPayment.booking._id}</p>
                  <p className="text-white">Amount: {formatCurrency(selectedPayment.booking.amount)}</p>
                  <p className="text-white">Status: {selectedPayment.booking.status}</p>
                </div>
              )}

              {selectedPayment.registration && (
                <div className="bg-neutral-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Course Registration Details</p>
                  <p className="text-white">ID: {selectedPayment.registration._id}</p>
                  <p className="text-white">Amount: {formatCurrency(selectedPayment.registration.amount)}</p>
                  <p className="text-white">Status: {selectedPayment.registration.status}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;