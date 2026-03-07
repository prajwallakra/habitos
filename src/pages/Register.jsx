import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import instance from "../utils/axios";

const Register = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await instance.post(
        "/api/auth/register",
        formData
      );

      setIsAuthenticated(true);
      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-(--bg-main)">
      <form className="bg-(--bg-main) p-6 rounded-lg shadow-lg shadow-zinc-700 w-80" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full mb-3 p-2 border border-(--border) rounded" required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full mb-3 p-2 border border-(--border) rounded" required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full mb-4 p-2 border border-(--border) rounded" required />
        <button type="submit" className="w-full bg-(--accent) text-white p-2 rounded hover:bg-blue-700 transition duration-200">Register</button>
        <p className="text-sm mt-3 text-center">Already have an account? 
            <Link to="/login" className="text-(--accent) hover:underline">
                Login
            </Link>
        </p>
      </form>
    </div>
  )
}

export default Register
