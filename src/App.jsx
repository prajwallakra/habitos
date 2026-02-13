import Leftbar from "./buildLayout/Leftbar/Leftbar"
import MainLayout from "./buildLayout/Mainlayout/Mainlayout"
import Sidebar from "./buildLayout/Sidebar/Sidebar"

function App() {
  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      <Sidebar />
      <MainLayout />
      <Leftbar />
    </div>
  )
}

export default App
