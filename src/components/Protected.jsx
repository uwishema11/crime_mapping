import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "sonner";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const userData = Cookies.get("user");
      if (!userData) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login");
        return;
      }

      try {
        const { user } = JSON.parse(userData);
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          toast.error(
            "You don't have permission to access this page.Login first to proceed."
          );
          navigate("/login");
          return;
        }
      } catch (error) {
        toast.error("Invalid session data. Please log in again.");
        navigate("/login");
        return;
      }
    };
    checkAuth();
  }, [allowedRoles]);

  return children;
};

export default ProtectedRoute;
