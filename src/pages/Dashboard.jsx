import MainLayout from "../buildLayout/Mainlayout/Mainlayout";
import Sidebar from "../buildLayout/Sidebar/Sidebar";
import Rightbar from "../buildLayout/Rightbar/Rightbar";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-(--bg-main) text-(--text-primary)">
      <Sidebar />
      <MainLayout />
      <Rightbar />
    </div>
  )
}

export default Dashboard
