import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllBookings,
  updateBookingStatus,
  updateBookingProgress,
} from "../../../api/bookingApi";
import { toast } from "react-hot-toast";

const AdminBookings = () => {
  const [filter, setFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["admin-bookings", filter],
    queryFn: () => getAllBookings({ status: filter }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ bookingId, status }) =>
      updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-bookings"]);
      toast.success("Booking status updated");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update booking");
    },
  });

  // ✅ Progress update mutation
  const updateProgressMutation = useMutation({
    mutationFn: ({ bookingId, progress }) =>
      updateBookingProgress(bookingId, progress),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-bookings"]);
      toast.success("Progress updated");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update progress",
      );
    },
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-400",
      confirmed: "bg-blue-500/20 text-blue-400",
      in_progress: "bg-purple-500/20 text-purple-400",
      completed: "bg-green-500/20 text-green-400",
      cancelled: "bg-red-500/20 text-red-400",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400";
  };

  // ✅ Progress color
  const getProgressColor = (progress) => {
    const colors = {
      "not-started": "bg-gray-500/20 text-gray-400",
      "in-progress": "bg-blue-500/20 text-blue-400",
      completed: "bg-green-500/20 text-green-400",
    };
    return colors[progress] || "bg-gray-500/20 text-gray-400";
  };

  // ✅ Format progress display
  const formatProgress = (progress) => {
    const labels = {
      "not-started": "Not Started",
      "in-progress": "In Progress",
      completed: "Completed",
    };
    return labels[progress] || progress || "Not Started";
  };

  const formatCurrency = (amount) => {
    return `₦${amount?.toLocaleString() || 0}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading bookings...</p>
        </div>
      </div>
    );
  }

  const bookingsArray = bookings || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Booking Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            Total: {bookingsArray.length} bookings
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {bookingsArray.length === 0 ? (
        <div className="bg-white/5 p-12 rounded-xl shadow text-center border border-neutral-800">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-gray-400 text-lg">No bookings found</p>
          <p className="text-gray-500 text-sm mt-2">
            Bookings will appear here once clients make bookings
          </p>
        </div>
      ) : (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800 border-b border-neutral-700">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">
                    Client
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">
                    Service/Plan
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">
                    Date
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">
                    Amount
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">
                    Status
                  </th>
                  {/* ✅ New Progress Column */}
                  <th className="text-left p-4 text-sm font-medium text-gray-400">
                    Progress
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookingsArray.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b border-neutral-800 hover:bg-neutral-800/50"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium">
                          {booking.user?.firstName} {booking.user?.lastName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {booking.user?.email}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {booking.service?.name || booking.package?.name || "N/A"}
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {formatDate(booking.bookingDate)}
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {formatCurrency(booking.amount)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${getStatusColor(booking.status)}`}
                      >
                        {booking.status || "N/A"}
                      </span>
                    </td>
                    {/* ✅ Progress Column */}
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${getProgressColor(booking.progress)}`}
                      >
                        {formatProgress(booking.progress)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        {/* Status Dropdown
                        <select
                          value={booking.status || "pending"}
                          onChange={(e) => {
                            updateStatusMutation.mutate({
                              bookingId: booking._id,
                              status: e.target.value,
                            });
                          }}
                          className="bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-amber-500 w-full"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select> */}

                        {/* ✅ Progress Dropdown */}
                        <select
                          value={booking.progress || "not-started"}
                          onChange={(e) => {
                            updateProgressMutation.mutate({
                              bookingId: booking._id,
                              progress: e.target.value,
                            });
                          }}
                          className="bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-amber-500 w-full"
                        >
                          <option value="not-started">Not Started</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
