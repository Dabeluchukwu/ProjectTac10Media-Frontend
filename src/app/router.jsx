import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedRoute from "../guards/ProtectedRoute";

// Layouts
const MainLayout = lazy(() => import("../layouts/MainLayout"));
const AuthLayout = lazy(() => import("../layouts/AuthLayout"));
const DashboardLayout = lazy(() => import("../layouts/DashboardLayout"));
const InstructorLayout = lazy(() => import("../layouts/InstructorLayout"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const SuperAdminLayout = lazy(() => import("../layouts/SuperAdminLayout"));

// Public Pages
const Home = lazy(() => import("../pages/public/Home/Home"));
const About = lazy(() => import("../pages/public/About/About"));
const Courses = lazy(() => import("../pages/public/Courses/Courses"));
const CourseDetails = lazy(() => import("../pages/public/Courses/CourseDetails"));
const LearnCourse = lazy(() => import("../pages/user/LearnCourse"));
const Contact = lazy(() => import("../pages/public/Contact/Contact"));
const Services = lazy(() => import("../pages/public/Services/Services"));
const Careers = lazy(() => import("../pages/public/Careers/Careers"));
const PlansAndPricing = lazy(() => import("../pages/public/PlansAndPricing/PlansAndPricing"));
const JobDetails = lazy(() => import("../pages/public/Careers/JobDetails"));


// Auth Pages
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

// Payment Pages
const PaymentCheckout = lazy(() => import("../pages/user/PaymentCheckout"));
const PaymentVerify = lazy(() => import("../pages/PaymentVerify"));

// User Dashboard Pages
const UserDashboard = lazy(() => import("../pages/user/Dashboard"));
const MyCourses = lazy(() => import("../pages/user/MyCourses"));
const MyBookings = lazy(() => import("../pages/user/MyBookings"));
const Payments = lazy(() => import("../pages/user/Payments"));
const Settings = lazy(() => import("../pages/user/Settings"));
const MyProgress = lazy(() => import("../pages/user/CourseProgress"));
const Exam = lazy(() => import("../pages/user/Exam"));
const ExamResults = lazy(() => import("../pages/user/ExamResults"));
const Certificates = lazy(() => import("../pages/user/Certificates"));
const Profile = lazy(() => import("../pages/user/Profile"));
const BookingForm = lazy(() => import("../pages/user/BookingForm"));

// Instructor Pages
const InstructorDashboard = lazy(() => import("../pages/instructor/Dashboard"));
const InstructorCourses = lazy(() => import("../pages/instructor/Courses"));
const InstructorCourseForm = lazy(() => import("../pages/instructor/CourseForm"));
const InstructorStudents = lazy(() => import("../pages/instructor/Students"));
const InstructorAnalytics = lazy(() => import("../pages/instructor/Analytics"));

// Admin Pages
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminUsers = lazy(() => import("../pages/admin/Users"));
const AdminCourses = lazy(() => import("../pages/admin/Courses/Courses"));
const AdminBookings = lazy(() => import("../pages/admin/Bookings/Bookings"));
const AdminCourseForm = lazy(() => import("../pages/admin/Courses/CourseForm"));
const AdminPayments = lazy(() => import("../pages/admin/Payments"));
const AdminJobs = lazy(() => import("../pages/admin/Jobs"));
const AdminPackages = lazy(() => import("../pages/admin/Packages/Packages"));
const PackageForm = lazy(() => import("../pages/admin/Packages/PackageForm"));
const AdminServices = lazy(() => import("../pages/admin/Services/Services"));
const ServiceForm = lazy(() => import("../pages/admin/Services/ServiceForm"));
const AdminManualPayments = lazy(() => import("../pages/admin/ManualPayments"));
const BankAccounts = lazy(() => import("../pages/admin/BankAccounts"));

// SuperAdmin Pages
const SuperAdminDashboard = lazy(() => import("../pages/super-admin/Dashboard"));
const SuperAdminUsers = lazy(() => import("../pages/super-admin/Users"));
const SuperAdminAdmins = lazy(() => import("../pages/super-admin/Admins"));
const SuperAdminSettings = lazy(() => import("../pages/super-admin/Settings"));
const SuperAdminAnalytics = lazy(() => import("../pages/super-admin/Analytics"));

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
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
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
    element: <PaymentVerify />,
  },

  // EXAM PAGES
  {
    path: "exam/:courseId",
    element: <Exam />,
  },
  {
    path: "exam/results/:examId",
    element: <ExamResults />,
  },

  // BOOKING
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

  // ADMIN ROUTES
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
          { path: "manual-payments", element: <AdminManualPayments /> },
{ path: "bank-accounts", element: <BankAccounts /> },
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
          { path: "manual-payments", element: <AdminManualPayments /> },
{ path: "bank-accounts", element: <BankAccounts /> },
        ],
      },
    ],
  },
]);

export default router;