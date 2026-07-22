import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Calendar, MapPin, FileText, CreditCard, ArrowLeft, CheckCircle, AlertCircle, Package, Wrench } from "lucide-react";
import { createBooking } from "../../api/bookingApi";
import { initializePayment } from "../../api/paymentApi";
import useAuthStore from "../../store/authStore";
import ManualPaymentModal from "../../components/payment/ManualPaymentModal";
import { PAYMENT_METHOD } from "../../config";

const BookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // State for manual payment modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualBooking, setManualBooking] = useState(null);

  // Get selected item from navigation state
  const { state } = location;
  const selectedItem = state || {};

  const [formData, setFormData] = useState({
    bookingDate: "",
    location: "",
    description: "",
    itemType: selectedItem.itemType || "service", // "plan" or "service"
    itemId: selectedItem.itemId || "",
    itemName: selectedItem.itemName || "",
    itemPrice: selectedItem.itemPrice || 0,
    itemDescription: selectedItem.itemDescription || "",
    features: selectedItem.features || [],
    services: selectedItem.services || [],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.bookingDate) {
      newErrors.bookingDate = "Booking date is required";
    }
    if (!formData.location || formData.location.trim().length < 3) {
      newErrors.location = "Location must be at least 3 characters";
    }
    if (!formData.itemId) {
      newErrors.itemId = "Please select a plan or service";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₦${amount?.toLocaleString() || 0}`;
  };

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (response) => {
      const booking = response?.data?.data;
      toast.success("Booking created successfully!");
      // Proceed to payment (manual or Paystack)
      handlePayment(booking);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create booking");
      setLoading(false);
    },
  });

  // Handle payment (now supports both manual and Paystack)
  const handlePayment = async (booking) => {
    // ✅ Check if manual payment is enabled
    if (PAYMENT_METHOD === "manual") {
      // Open the manual payment modal with the booking
      setManualBooking(booking);
      setShowManualModal(true);
      setLoading(false); // stop loading because we're showing the modal
      return;
    }

    // 🔵 Paystack flow (original)
    try {
      const paymentResponse = await initializePayment({
        purpose: "booking",
        bookingId: booking._id,
        email: user?.email,
        referenceId: booking._id,
        amount: booking.amount,
      });

      if (paymentResponse?.data?.data?.authorizationUrl) {
        window.location.href = paymentResponse.data.data.authorizationUrl;
      } else {
        toast.error("Failed to initialize payment. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error(error?.response?.data?.message || "Failed to initialize payment. Please try again.");
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix all errors before continuing.");
      return;
    }

    setLoading(true);

    const bookingData = {
      bookingType: formData.itemType === "plan" ? "package" : "service",
      service: formData.itemType === "service" ? formData.itemId : null,
      package: formData.itemType === "plan" ? formData.itemId : null,
      bookingDate: formData.bookingDate,
      location: formData.location,
      description: formData.description,
      amount: formData.itemPrice,
    };

    createBookingMutation.mutate(bookingData);
  };

  // If no item is selected, redirect to plans page
  useEffect(() => {
    if (!selectedItem.itemId && !selectedItem.itemName) {
      toast.error("Please select a plan or service first.");
      navigate("/plans-and-pricing");
    }
  }, [selectedItem, navigate]);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition p-2"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-amber-400">Book Service</h1>
            <p className="text-gray-400">Complete the form to book your selected plan or service</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
              {/* Selected Item Summary */}
              <div className="bg-neutral-800/50 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  {formData.itemType === "plan" ? (
                    <Package className="text-amber-400 mt-1" size={20} />
                  ) : (
                    <Wrench className="text-amber-400 mt-1" size={20} />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">
                      {formData.itemType === "plan" ? "Selected Plan" : "Selected Service"}
                    </p>
                    <h3 className="text-xl font-semibold text-white">{formData.itemName}</h3>
                    <p className="text-amber-400 font-bold">{formatCurrency(formData.itemPrice)}</p>
                    {formData.services && formData.services.length > 0 && (
                      <div className="mt-2 text-sm text-gray-400">
                        <p className="text-xs text-gray-500 mb-1">Includes:</p>
                        <ul className="space-y-1">
                          {formData.services.slice(0, 3).map((service, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle size={14} className="text-green-400" />
                              <span>{service.name || "Service"}</span>
                            </li>
                          ))}
                          {formData.services.length > 3 && (
                            <li className="text-xs text-gray-500">
                              +{formData.services.length - 3} more services
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/plans-and-pricing")}
                    className="text-sm text-amber-400 hover:text-amber-300 transition"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Booking Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Booking Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="date"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full bg-neutral-800 border rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 ${
                      errors.bookingDate ? "border-red-500" : "border-neutral-700"
                    }`}
                    required
                  />
                </div>
                {errors.bookingDate && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.bookingDate}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g., Lagos, Nigeria"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full bg-neutral-800 border rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 ${
                      errors.location ? "border-red-500" : "border-neutral-700"
                    }`}
                    required
                  />
                </div>
                {errors.location && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.location}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Additional Notes
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-500" size={20} />
                  <textarea
                    name="description"
                    placeholder="Any special requirements or additional information..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || createBookingMutation.isPending}
                className="w-full bg-amber-500 text-black py-3 rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading || createBookingMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Book Now - {formatCurrency(formData.itemPrice)}
                  </>
                )}
              </button>

              {/* Dynamic message based on payment method */}
              <p className="text-xs text-gray-500 text-center mt-4">
                {PAYMENT_METHOD === "manual"
                  ? "After booking, you will be asked to upload your payment receipt for manual confirmation."
                  : "You will be redirected to Paystack to complete your payment securely."}
              </p>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4">Booking Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Item Type</span>
                  <span className="text-white capitalize">{formData.itemType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Item</span>
                  <span className="text-white font-medium">{formData.itemName}</span>
                </div>
                {formData.bookingDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date</span>
                    <span className="text-white">
                      {new Date(formData.bookingDate).toLocaleDateString("en-NG", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {formData.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location</span>
                    <span className="text-white">{formData.location}</span>
                  </div>
                )}
                <div className="border-t border-neutral-800 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total</span>
                    <span className="text-2xl font-bold text-amber-400">
                      {formatCurrency(formData.itemPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-xs text-amber-400 text-center">
                  {PAYMENT_METHOD === "manual"
                    ? "💳 Manual payment via bank transfer"
                    : "🔒 Secure payment powered by Paystack"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Manual Payment Modal */}
      {showManualModal && manualBooking && (
        <ManualPaymentModal
          isOpen={showManualModal}
          onClose={() => {
            setShowManualModal(false);
            setManualBooking(null);
            // Optionally navigate to bookings page
            navigate("/dashboard/bookings");
          }}
          purpose="booking"
          referenceId={manualBooking._id}
          amount={manualBooking.amount}
          onSuccess={() => {
            queryClient.invalidateQueries(["my-bookings"]);
            // Optionally navigate to bookings page after success
            navigate("/dashboard/bookings");
          }}
        />
      )}
    </div>
  );
};

export default BookingForm;