import { useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/user";

const userRole = Cookies.get("user");
let user;

if (userRole) {
  const parsedUser = JSON.parse(userRole);
  const role = parsedUser.role;
  user = role;
  console.log(user);
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const response = await login(email, password);
    if (response.success === true) {
      const token = response.data?.token;
      const user = response.data?.user;
      Cookies.set("user", JSON.stringify({ token, user }));
      toast.success("Login successful");
      if (user.role === "USER") {
        return navigate("/user-dashboard");
      } else {
        return navigate("/");
      }
    }
    return toast.error(`${response.message}`);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">
          Login
        </h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center text-sm mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};
export default Login;
