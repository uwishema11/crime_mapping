import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import useAuthStore from '@/store/auth';
import { FadeLoader } from 'react-spinners';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { verifyToken } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const userToken = Cookies.get('user');

      if (!userToken) {
        toast.error('Please login to access this page');
        navigate('/login', { state: { from: location.pathname } });
        return;
      }

      try {
        const parsedUser = JSON.parse(userToken);
        const token = parsedUser.token;
        const response = await verifyToken(token);

        if (!response.success) {
          toast.error(response.message || 'Session expired. Please login again');
          Cookies.remove('user');
          navigate('/login');
          return;
        }

        // Check if user has required role
        if (allowedRoles.length > 0 && !allowedRoles.includes(response.user.role)) {
          toast.error("You don't have permission to access this page");
          if (response.user.role === 'USER') {
            navigate('/user-dashboard');
          } else if (['ADMIN', 'MANAGER'].includes(response.user.role)) {
            navigate('/');
          } else {
            navigate('/login');
          }
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check error:', error);
        toast.error('Session error. Please login again');
        Cookies.remove('user');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname, allowedRoles, verifyToken]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
