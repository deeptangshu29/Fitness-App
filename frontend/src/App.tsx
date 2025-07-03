import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";

// Pages
import HomePage from "./pages/HomePage";
import UsersPage from "./pages/UsersPage";
import TrainersPage from "./pages/TrainersPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import MealsPage from "./pages/MealsPage";
import GoalsPage from "./pages/GoalsPage";
import WeatherPage from "./pages/WeatherPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Auth
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RootLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="trainers" element={<TrainersPage />} />
            <Route path="workouts" element={<WorkoutsPage />} />
            <Route path="meals" element={<MealsPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="weather" element={<WeatherPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
