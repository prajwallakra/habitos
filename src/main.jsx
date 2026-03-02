import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { AppProvider } from "./context/AppContext.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"

/* ---------- THEME INIT (prevents flash on reload) ---------- */
const savedTheme = localStorage.getItem("theme") || "dark"
document.documentElement.setAttribute("data-theme", savedTheme)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AppProvider>
  </React.StrictMode>
)