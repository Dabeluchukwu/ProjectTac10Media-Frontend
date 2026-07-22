import { useState, useEffect } from "react";
import { X, Upload, CheckCircle, AlertCircle, Banknote } from "lucide-react";
import { toast } from "react-hot-toast";
import { submitManualPayment } from "../../api/paymentApi";
import CloudinaryUpload from "../common/CloudinaryUpload";
import useAuthStore from "../../store/authStore";

const ManualPaymentModal = ({ isOpen, onClose, purpose, referenceId, amount, onSuccess }) => {
  const { user } = useAuthStore();
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [receiptPublicId, setReceiptPublicId] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch bank accounts
  useEffect(() => {
    if (isOpen) {
      fetchBankAccounts();
    }
  }, [isOpen]);

  const fetchBankAccounts = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("🔍 Fetching bank accounts, token:", !!token);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/bank-accounts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("📡 Response status:", response.status);
    const data = await response.json();
    console.log("📦 Bank accounts response:", data);
    if (data.success && Array.isArray(data.data)) {
      const activeAccounts = data.data.filter((acc) => acc.isActive);
      setBankAccounts(activeAccounts);
    } else {
      console.error("Unexpected response structure:", data);
      toast.error("Failed to load bank accounts");
    }
  } catch (error) {
    console.error("Error fetching bank accounts:", error);
    toast.error("Failed to load bank accounts");
  } finally {
    setIsLoading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBank) {
      toast.error("Please select a bank account");
      return;
    }
    if (!receiptUrl) {
      toast.error("Please upload your payment receipt");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitManualPayment({
        purpose,
        referenceId,
        receiptUrl,
        receiptPublicId,
        bankAccountId: selectedBank,
        notes,
      });

      toast.success("Payment submitted successfully! Awaiting admin confirmation.");
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Manual payment submission failed:", error);
      toast.error(error?.response?.data?.message || "Failed to submit payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const formatCurrency = (amount) => `₦${amount?.toLocaleString() || 0}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800 sticky top-0 bg-neutral-900 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">💳 Manual Payment</h2>
            <p className="text-sm text-gray-400">Pay via bank transfer</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Amount */}
          <div className="bg-neutral-800 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-400">Amount to Pay</p>
            <p className="text-3xl font-bold text-amber-400">{formatCurrency(amount)}</p>
          </div>

          {/* Bank Accounts */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Transfer to any of these accounts:
            </label>
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-12 bg-neutral-800 rounded-lg"></div>
                <div className="h-12 bg-neutral-800 rounded-lg"></div>
              </div>
            ) : bankAccounts.length === 0 ? (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-yellow-400 text-sm">
                ⚠️ No bank accounts available. Please contact support.
              </div>
            ) : (
              <div className="space-y-2">
                {bankAccounts.map((account) => (
                  <label
                    key={account._id}
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition ${
                      selectedBank === account._id
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-neutral-700 hover:border-neutral-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="bankAccount"
                      value={account._id}
                      checked={selectedBank === account._id}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-white">{account.bankName}</p>
                      <p className="text-sm text-gray-400">
                        {account.accountName} · {account.accountNumber}
                      </p>
                    </div>
                    <Banknote size={20} className="text-gray-500" />
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Receipt Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Upload Payment Receipt (Screenshot or PDF)
            </label>
            <CloudinaryUpload
              value={receiptUrl}
              onChange={(url) => {
                setReceiptUrl(url);
                // Cloudinary doesn't return publicId directly, we'll use the URL
                const publicId = url.split("/").pop().split(".")[0];
                setReceiptPublicId(publicId);
              }}
              onRemove={() => {
                setReceiptUrl("");
                setReceiptPublicId("");
              }}
              label="Receipt"
              folder="payment-receipts"
            />
            {receiptUrl && (
              <p className="text-xs text-green-400 mt-1">✅ Receipt uploaded</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information about your payment..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              rows="3"
            />
          </div>

          {/* Important Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-400 font-medium">Important:</p>
                <ul className="text-xs text-blue-300/80 space-y-1 mt-1">
                  <li>• Transfer the exact amount shown above</li>
                  <li>• Upload a clear screenshot or PDF of your payment receipt</li>
                  <li>• Your booking/course will be activated once admin confirms payment</li>
                  <li>• You'll receive a notification when confirmed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedBank || !receiptUrl}
            className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              isSubmitting || !selectedBank || !receiptUrl
                ? "bg-neutral-700 text-gray-500 cursor-not-allowed"
                : "bg-amber-500 text-black hover:bg-amber-600"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                Submitting...
              </>
            ) : (
              <>
                <Upload size={20} />
                Submit Payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualPaymentModal;