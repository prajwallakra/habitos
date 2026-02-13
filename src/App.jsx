import MainLayout from "./buildLayout/Mainlayout/Mainlayout"
import Sidebar from "./buildLayout/Sidebar/Sidebar"
import Rightbar from "./buildLayout/Rightbar/Rightbar"

function App() {
  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      <Sidebar />
      <MainLayout />
      <Rightbar />
    </div>
  )
}

export default App
