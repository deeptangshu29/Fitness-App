import { createContext, useEffect, useState } from "react";
import { getToken, removeToken, setToken } from "@/lib/auth";

interface User {
	// Define user properties as needed, for example:
	id: string;
	name: string;
	email: string;
	// Add more fields as required
}

interface AuthContextType {
	user: User | null;
	login: (token: string) => void;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Remove useAuth export from this file. Move to a new file named useAuth.ts.

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());

	const login = (token: string) => {
		setToken(token);
		setIsAuthenticated(true);
		// optionally fetch user profile here
	};

	const logout = () => {
		removeToken();
		setUser(null);
		setIsAuthenticated(false);
	};

	useEffect(() => {
		if (getToken()) {
			setIsAuthenticated(true);
		}
	}, []);

	return (
		<AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
