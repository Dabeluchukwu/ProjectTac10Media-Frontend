import useAuthStore from "../../store/authStore";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StudentView from "../../components/dashboard/roles/StudentView";
import ClientView from "../../components/dashboard/roles/ClientView";

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  return (
    <div>
      <DashboardHeader />
      {role === "student" && <StudentView />}
      {role === "client" && <ClientView />}
      {!role && (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;