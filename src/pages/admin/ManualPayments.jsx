import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getPendingManualPayments,
  getAllManualPayments,
  confirmManualPayment, 
  rejectManualPayment 
} from "../../api/paymentApi";
import { toast } from "react-hot-toast";

const AdminManualPayments = () => {
  const [filter, setFilter] = useState("pending");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [confirmNotes, setConfirmNotes] = useState("");
  const queryClient = useQueryClient();

  // ✅ Format currency function - DEFINED EARLY
  const formatCurrency = (amount) => `₦${amount?.toLocaleString() || 0}`;
  const formatDate = (date) => new Date(date).toLocaleString();

  // ✅ Use correct API based on filter
  const { data: payments, isLoading } = useQuery({
    queryKey: ["admin-manual-payments", filter],
    queryFn: () => {
      if (filter === "pending") {
        return getPendingManualPayments();
      } else if (filter === "all") {
        return getAllManualPayments();
      } else {
        return getAllManualPayments(filter);
      }
    },
  });

  const confirmMutation = useMutation({
    mutationFn: ({ id, notes }) => confirmManualPayment(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-manual-payments"]);
      toast.success("Payment confirmed successfully!");
      setIsConfirmModalOpen(false);
      setSelectedPayment(null);
      setConfirmNotes("");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to confirm payment");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, rejectionReason }) => rejectManualPayment(id, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-manual-payments"]);
      toast.success("Payment rejected");
      setIsRejectModalOpen(false);
      setSelectedPayment(null);
      setRejectionReason("");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to reject payment");
    },
  });

  const handleConfirmClick = (payment) => {
    setSelectedPayment(payment);
    setIsConfirmModalOpen(true);
  };

  const handleRejectClick = (payment) => {
    setSelectedPayment(payment);
    setIsRejectModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    if (selectedPayment) {
      confirmMutation.mutate({ 
        id: selectedPayment._id, 
        notes: confirmNotes 
      });
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    if (selectedPayment) {
      rejectMutation.mutate({ 
        id: selectedPayment._id, 
        rejectionReason: rejectionReason 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const paymentList = payments?.data?.data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manual Payments</h1>
          <p className="text-gray-400 text-sm mt-1">
            Total: {paymentList.length} payments
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>
      </div>

      {paymentList.length === 0 ? (
        <div className="bg-white/5 p-12 rounded-xl text-center border border-neutral-800">
          <div className="text-6xl mb-4">💰</div>
          <p className="text-gray-400 text-lg">No manual payments found</p>
        </div>
      ) : (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800 border-b border-neutral-700">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Purpose</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Receipt</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paymentList.map((payment) => (
                  <tr key={payment._id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{payment.user?.firstName} {payment.user?.lastName}</p>
                        <p className="text-xs text-gray-400">{payment.user?.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {payment.purpose === "booking" ? "📅 Booking" : "📚 Course"}
                    </td>
                    <td className="p-4 text-sm text-gray-300 font-medium">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        payment.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                        payment.status === "confirmed" ? "bg-green-500/20 text-green-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="p-4">
                      {payment.receiptUrl && (
                        <a
                          href={payment.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:text-amber-300 text-sm underline"
                        >
                          View Receipt
                        </a>
                      )}
                    </td>
                    <td className="p-4">
                      {payment.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConfirmClick(payment)}
                            className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm hover:bg-green-500/30 transition"
                          >
                            ✅ Confirm
                          </button>
                          <button
                            onClick={() => handleRejectClick(payment)}
                            className="bg-red-500/20 text-red-400 px-3 py-1 rounded text-sm hover:bg-red-500/30 transition"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                      {payment.status === "confirmed" && (
                        <span className="text-xs text-green-400">✅ Confirmed by {payment.confirmedBy?.firstName}</span>
                      )}
                      {payment.status === "rejected" && (
                        <div>
                          <span className="text-xs text-red-400">❌ Rejected</span>
                          {payment.rejectionReason && (
                            <p className="text-xs text-gray-500 mt-1">{payment.rejectionReason}</p>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ✅ Confirm Modal */}
      {isConfirmModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Confirm Payment</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">User:</span>
                  <span className="text-white">{selectedPayment.user?.firstName} {selectedPayment.user?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-amber-400 font-bold">{formatCurrency(selectedPayment.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Purpose:</span>
                  <span className="text-white">{selectedPayment.purpose}</span>
                </div>
                {selectedPayment.receiptUrl && (
                  <div>
                    <a
                      href={selectedPayment.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 text-sm underline"
                    >
                      📎 View Receipt
                    </a>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={confirmNotes}
                  onChange={(e) => setConfirmNotes(e.target.value)}
                  placeholder="Add any notes about this confirmation..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  rows="3"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmSubmit}
                  disabled={confirmMutation.isPending}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {confirmMutation.isPending ? "Confirming..." : "✅ Confirm Payment"}
                </button>
                <button
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setSelectedPayment(null);
                    setConfirmNotes("");
                  }}
                  className="flex-1 bg-neutral-800 text-gray-400 py-2 rounded-lg font-semibold hover:bg-neutral-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Reject Modal */}
      {isRejectModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Reject Payment</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">User:</span>
                  <span className="text-white">{selectedPayment.user?.firstName} {selectedPayment.user?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-amber-400 font-bold">{formatCurrency(selectedPayment.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Purpose:</span>
                  <span className="text-white">{selectedPayment.purpose}</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this payment is being rejected..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  rows="3"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRejectSubmit}
                  disabled={rejectMutation.isPending}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                >
                  {rejectMutation.isPending ? "Rejecting..." : "❌ Reject Payment"}
                </button>
                <button
                  onClick={() => {
                    setIsRejectModalOpen(false);
                    setSelectedPayment(null);
                    setRejectionReason("");
                  }}
                  className="flex-1 bg-neutral-800 text-gray-400 py-2 rounded-lg font-semibold hover:bg-neutral-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManualPayments;