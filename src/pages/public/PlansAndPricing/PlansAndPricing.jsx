import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getPackages, getServices } from "../../../api/serviceApi";
import { toast } from "react-hot-toast";

const PlansAndPricing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all"); // all, plans, services
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch packages (plans)
  const { data: packages, isLoading: packagesLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: getPackages,
  });

  // Fetch services
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const isLoading = packagesLoading || servicesLoading;

  // Get all categories from both services and packages
  const allCategories = [
    ...new Set([
      ...(services?.data?.data?.map((s) => s.category) || []),
      ...(packages?.data?.data?.map((p) => p.category) || []),
    ]),
  ].filter(Boolean);

  const packagesData = packages?.data?.data || [];
  const servicesData = services?.data?.data || [];

  // Filter by tab and category
  const filteredPackages = packagesData.filter((pkg) => {
    if (selectedCategory !== "all" && pkg.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const filteredServices = servicesData.filter((service) => {
    if (selectedCategory !== "all" && service.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleBookNow = (item, type) => {
    navigate(`/booking`, {
      state: {
        itemId: item._id,
        itemType: type, // "plan" or "service"
        itemName: item.name,
        itemPrice: item.price,
        itemDescription: item.description,
        itemImage: item.image,
        // If it's a package, include the services list
        ...(type === "plan" && { services: item.services }),
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading plans and services...</p>
        </div>
      </div>
    );
  }

  const hasPlans = filteredPackages.length > 0;
  const hasServices = filteredServices.length > 0;
  const showNothing = !hasPlans && !hasServices;

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-neutral-900 via-amber-900/30 to-neutral-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Plans &amp; Pricing
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose from our professional service packages or individual services
            tailored to your needs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex gap-2 bg-neutral-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-2 rounded-lg transition ${
                activeTab === "all"
                  ? "bg-amber-500 text-black"
                  : "hover:bg-neutral-700 text-gray-400"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("plans")}
              className={`px-6 py-2 rounded-lg transition ${
                activeTab === "plans"
                  ? "bg-amber-500 text-black"
                  : "hover:bg-neutral-700 text-gray-400"
              }`}
            >
              📦 Plans
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`px-6 py-2 rounded-lg transition ${
                activeTab === "services"
                  ? "bg-amber-500 text-black"
                  : "hover:bg-neutral-700 text-gray-400"
              }`}
            >
              🎯 Services
            </button>
          </div>

          {/* Category Filter */}
          {allCategories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Content */}
        {showNothing ? (
          <div className="bg-white/5 p-12 rounded-xl shadow text-center border border-neutral-800">
            <p className="text-gray-400 text-lg">
              No plans or services available yet.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Please check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Plans Section */}
            {(activeTab === "all" || activeTab === "plans") && hasPlans && (
              <div>
                <h2 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-3">
                  <span>📦</span> Service Plans
                </h2>
                <p className="text-gray-400 mb-6">
                  Complete packages with everything you need.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPackages.map((pkg) => (
                    <div
                      key={pkg._id}
                      className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-amber-500/50 transition-all duration-300 group"
                    >
                      {/* Image */}
                      {pkg.image && (
                        <img
                          src={pkg.image}
                          alt={pkg.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                        />
                      )}
                      {!pkg.image && (
                        <div className="w-full h-48 bg-gradient-to-r from-amber-900/30 to-neutral-800 flex items-center justify-center">
                          <span className="text-6xl">📦</span>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-white">
                            {pkg.name}
                          </h3>
                          {pkg.category && (
                            <span className="text-xs bg-neutral-700 text-gray-300 px-2 py-1 rounded">
                              {pkg.category}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {pkg.description}
                        </p>

                        {/* Features */}
                        {/* Features */}
{pkg.features && pkg.features.length > 0 && (
  <div className="mb-4">
    <p className="text-xs text-gray-500 mb-2">What's included:</p>
    <ul className="space-y-1">
      {pkg.features.slice(0, 5).map((feature, index) => (
        <li
          key={index}
          className="text-sm text-gray-300 flex items-start gap-2"
        >
          <span className="text-amber-400">✓</span>
          <span className="text-sm">{feature}</span>
        </li>
      ))}
      {pkg.features.length > 5 && (
        <li className="text-sm text-gray-500">
          +{pkg.features.length - 5} more features
        </li>
      )}
    </ul>
  </div>
)}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-800">
                          <div>
                            <p className="text-sm text-gray-400">Price</p>
                            <p className="text-2xl font-bold text-amber-400">
                              ₦{pkg.price.toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleBookNow(pkg, "plan")}
                            className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services Section */}
            {(activeTab === "all" || activeTab === "services") && hasServices && (
              <div>
                <h2 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-3">
                  <span>🎯</span> Individual Services
                </h2>
                <p className="text-gray-400 mb-6">
                  Pick and choose the specific services you need.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <div
                      key={service._id}
                      className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-amber-500/50 transition-all duration-300 group"
                    >
                      {service.image && (
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                        />
                      )}
                      {!service.image && (
                        <div className="w-full h-48 bg-gradient-to-r from-amber-900/30 to-neutral-800 flex items-center justify-center">
                          <span className="text-6xl">🎯</span>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-white">
                            {service.name}
                          </h3>
                          {service.category && (
                            <span className="text-xs bg-neutral-700 text-gray-300 px-2 py-1 rounded">
                              {service.category}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {service.description}
                        </p>

                        {service.duration && (
                          <p className="text-sm text-gray-500 mb-3">
                            ⏱️ {service.duration}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-800">
                          <div>
                            <p className="text-sm text-gray-400">Price</p>
                            <p className="text-2xl font-bold text-amber-400">
                              ₦{service.price.toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleBookNow(service, "service")}
                            className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansAndPricing;