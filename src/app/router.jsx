import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedRoute from "../guards/ProtectedRoute";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
// import AdminLayout from "../layouts/AdminLayout";

// Public Pages
const Home = lazy(() => import("../pages/public/Home/Home"));
const About = lazy(() => import("../pages/public/About/About"));
const Courses = lazy(() => import("../pages/public/Courses/Courses"));
const CourseDetails = lazy(
  () => import("../pages/public/Courses/CourseDetails"),
);
const LearnCourse = lazy(() => import("../pages/user/LearnCourse"));
const Contact = lazy(() => import("../pages/public/Contact/Contact"));
const Services = lazy(() => import("../pages/public/Services/Services"));
const Careers = lazy(() => import("../pages/public/Careers/Careers"));
import PlansAndPricing from "../pages/public/PlansAndPricing/PlansAndPricing";
import JobDetails from "../pages/public/Careers/JobDetails";

// Auth Pages
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));

// payment Checkout
const PaymentCheckout = lazy(() => import("../pages/user/PaymentCheckout"));

// User
const UserDashboard = lazy(() => import("../pages/user/Dashboard"));
import MyCourses from "../pages/user/MyCourses";
import MyBookings from "../pages/user/MyBookings";
import Payments from "../pages/user/Payments";
import Settings from "../pages/user/Settings";
import MyProgress from "../pages/user/CourseProgress";
import Exam from "../pages/user/Exam";
import ExamResults from "../pages/user/ExamResults";
import Certificates from "../pages/user/Certificates";

// Profile page
import Profile from "../pages/user/Profile";

// Booking Route
import BookingForm from "../pages/user/BookingForm";

// Instructor Pages
import InstructorLayout from "../layouts/InstructorLayout";
import InstructorDashboard from "../pages/instructor/Dashboard";
import InstructorCourses from "../pages/instructor/Courses";
import InstructorCourseForm from "../pages/instructor/CourseForm";
import InstructorStudents from "../pages/instructor/Students";
import InstructorAnalytics from "../pages/instructor/Analytics";

// Admin Routes
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminCourses from "../pages/admin/Courses/Courses";
import AdminBookings from "../pages/admin/Bookings/Bookings";
import AdminCourseForm from "../pages/admin/Courses/CourseForm";
import AdminPayments from "../pages/admin/Payments";
import AdminJobs from "../pages/admin/Jobs";

import AdminPackages from "../pages/admin/Packages/Packages";
import PackageForm from "../pages/admin/Packages/PackageForm";
import AdminServices from "../pages/admin/Services/Services";
import ServiceForm from "../pages/admin/Services/ServiceForm";

// SuperAdmin Dashboard
import SuperAdminLayout from "../layouts/SuperAdminLayout";
import SuperAdminDashboard from "../pages/super-admin/Dashboard";
import SuperAdminUsers from "../pages/super-admin/Users";
import SuperAdminAdmins from "../pages/super-admin/Admins";
import SuperAdminSettings from "../pages/super-admin/Settings";
import SuperAdminAnalytics from "../pages/super-admin/Analytics";

const router = createBrowserRouter([
  // PUBLIC PAGES
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "About", element: <About /> },
      { path: "Courses", element: <Courses /> },
      { path: "courses/:id", element: <CourseDetails /> },
      { path: "Contact", element: <Contact /> },
      { path: "Services", element: <Services /> },
      { path: "Careers", element: <Careers /> },
      { path: "plans-and-pricing", element: <PlansAndPricing /> },
      { path: "careers/:id", element: <JobDetails /> },
    ],
  },

  // AUTH PAGES
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  // PAYMENT PAGES
  {
    path: "checkout/:courseId",
    element: <PaymentCheckout />,
  },
  {
    path: "payments",
    element: <Payments />,
  },
  {
    path: "payment",
    element: <PaymentCheckout />,
  },
  {
    path: "payment/verify",
    element: <PaymentCheckout />,
  },

  // ✅ EXAM PAGES - MOVED TO ROOT LEVEL
  {
    path: "exam/:courseId",
    element: <Exam />,
  },
  {
    path: "exam/results/:examId",
    element: <ExamResults />,
  },

  {
    path: "booking",
    element: <BookingForm />,
  },

  // USER DASHBOARD
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <UserDashboard /> },
      { path: "courses", element: <MyCourses /> },
      { path: "learn/:courseId", element: <LearnCourse /> },
      { path: "bookings", element: <MyBookings /> },
      { path: "payments", element: <Payments /> },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <Settings /> },
      { path: "progress", element: <MyProgress /> },
      { path: "certificates", element: <Certificates /> },
      { path: "profile", element: <Profile /> },
    ],
  },

  // INSTRUCTOR DASHBOARD
  {
    path: "/instructor",
    element: <ProtectedRoute allowedRoles={["instructor", "admin"]} />,
    children: [
      {
        element: <InstructorLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/instructor/dashboard" replace />,
          },
          { path: "dashboard", element: <InstructorDashboard /> },
          { path: "courses", element: <InstructorCourses /> },
          { path: "courses/new", element: <InstructorCourseForm /> },
          { path: "courses/:id/edit", element: <InstructorCourseForm /> },
          { path: "students", element: <InstructorStudents /> },
          { path: "analytics", element: <InstructorAnalytics /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },

  // Admin routes
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["admin", "superAdmin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "users", element: <AdminUsers /> },
          { path: "courses", element: <AdminCourses /> },
          { path: "bookings", element: <AdminBookings /> },
          { path: "courses/create", element: <AdminCourseForm /> },
          { path: "courses/:id/edit", element: <AdminCourseForm /> },
          { path: "payments", element: <AdminPayments /> },
          { path: "jobs", element: <AdminJobs /> },
          { path: "profile", element: <Profile /> },
          {
            path: "packages",
            children: [
              { index: true, element: <AdminPackages /> },
              { path: "create", element: <PackageForm /> },
              { path: ":id/edit", element: <PackageForm /> },
            ],
          },
          {
            path: "services",
            children: [
              { index: true, element: <AdminServices /> },
              { path: "create", element: <ServiceForm /> },
              { path: ":id/edit", element: <ServiceForm /> },
            ],
          },
        ],
      },
    ],
  },

  // SUPER ADMIN DASHBOARD
  {
    path: "/super-admin",
    element: <ProtectedRoute allowedRoles={["superAdmin"]} />,
    children: [
      {
        element: <SuperAdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/super-admin/dashboard" replace />,
          },
          { path: "dashboard", element: <SuperAdminDashboard /> },
          { path: "users", element: <SuperAdminUsers /> },
          { path: "admins", element: <SuperAdminAdmins /> },
          { path: "settings", element: <SuperAdminSettings /> },
          { path: "analytics", element: <SuperAdminAnalytics /> },
          { path: "profile", element: <Profile /> },
          { path: "courses", element: <AdminCourses /> },
          { path: "bookings", element: <AdminBookings /> },
          { path: "jobs", element: <AdminJobs /> },
          { path: "payments", element: <AdminPayments /> },
          {
            path: "packages",
            children: [
              { index: true, element: <AdminPackages /> },
              { path: "create", element: <PackageForm /> },
              { path: ":id/edit", element: <PackageForm /> },
            ],
          },
          {
            path: "services",
            children: [
              { index: true, element: <AdminServices /> },
              { path: "create", element: <ServiceForm /> },
              { path: ":id/edit", element: <ServiceForm /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
