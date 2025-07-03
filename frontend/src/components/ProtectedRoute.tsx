import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
	children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated } = useAuth();

	return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}
