import { Routes, Route, Navigate } from "react-router-dom";
import { Thread } from "@/components/thread";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { SignupScreen } from "@/components/auth/SignupScreen";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/providers/Auth";
import "./App.css";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Thread />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" /> : <LoginScreen />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to="/" /> : <SignupScreen />} 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
