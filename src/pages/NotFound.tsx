import { useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn("404: redirecting unknown route to home:", location.pathname);
  }, [location.pathname]);

  // Gracefully send unknown paths back to the homepage
  return <Navigate to="/" replace />;
};

export default NotFound;
