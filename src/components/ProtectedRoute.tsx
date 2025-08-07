import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("crime-vision-user");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  const user = localStorage.getItem("crime-vision-user");
  
  if (!user) {
    return null;
  }

  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

export default ProtectedRoute;